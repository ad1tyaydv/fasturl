import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import shortUrlGenerator from "@/app/helpers/shortUrlGenerator";
import { redis } from "@/lib/redis";
import { nonVerifiedRateLimit, verifiedRateLimit } from "@/lib/rateLimit";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;
const ANON_USER_ID = process.env.ANONYMOUS_USER_ID!;

function add30Days(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 30);
  return d;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const data = await req.json();
    const token = req.cookies.get("token")?.value;

    let userId = ANON_USER_ID;
    let user: any = null;

    if (!token) {
      const { success } = await nonVerifiedRateLimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { message: "Too many requests. Try later." },
          { status: 429 }
        );
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const count = await prisma.link.count({
        where: {
          ipAddress: ip,
          userId: ANON_USER_ID,
          createdAt: { gte: today },
        },
      });

      if (count >= 1) {
        return NextResponse.json(
          { message: "Anonymous users can only create 1 link/day" },
          { status: 403 }
        );
      }
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
      };

      userId = decoded.userId;

      user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const { success } = await verifiedRateLimit.limit(userId);

      if (!success) {
        return NextResponse.json(
          { message: "Too many requests. Try later." },
          { status: 429 }
        );
      }

      const now = new Date();

      let cycleStart = user.cycleStart;
      let cycleEnd = user.cycleEnd;

      if (!cycleStart || !cycleEnd) {
        cycleStart = user.plan === "FREE" ? user.createdAt : user.planStartedAt || new Date();

        cycleEnd = add30Days(cycleStart);

        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            cycleStart: cycleStart,
            cycleEnd: cycleEnd
          },
        });
      }

      if (cycleEnd && now > new Date(cycleEnd)) {
        cycleStart = now;
        cycleEnd = add30Days(now);

        await prisma.user.update({
          where: { id: userId },
          data: {
            cycleStart: cycleStart,
            cycleEnd: cycleEnd
          },
        });
      }

      let limit = 100;
      if (user.plan === "ESSENTIAL") limit = 10000;
      if (user.plan === "PRO") limit = 40000;

      const count = await prisma.link.count({
        where: {
          userId,
          createdAt: {
            gte: cycleStart,
            lt: cycleEnd,
          },
        },
      });

      if (count >= limit) {
        return NextResponse.json(
          { message: user.plan === "FREE" ? "Upgrade to continue" : "Plan limit reached" },
          { status: 429 }
        );
      }
    }

    let originalLink = data.url;

    if (!originalLink.startsWith("http://") && !originalLink.startsWith("https://")) {
      originalLink = "https://" + originalLink;
    }

    const shortUrl = shortUrlGenerator();

    const urlShort = await prisma.$transaction(async (tx) => {
      const created = await tx.link.create({
        data: {
          userId,
          original: originalLink,
          shorturl: shortUrl,
          ipAddress: ip,
        },
      });

      await tx.user.update({
        where: {
          id: userId
        },
        data: {
          totalLinks: {
            decrement: 1,
          },
        },
      });

      const cacheKey = `links-left:${userId}`;
      await redis.decr(cacheKey);

      return created;
    });

    await redis.del(`fetchLinks:${userId}`);

    return NextResponse.json({
      message: "Short URL created!",
      shortUrl: urlShort!.shorturl,
      original: urlShort!.original,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}