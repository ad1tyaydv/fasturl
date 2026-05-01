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

    let domain = null;
    let subDomain = null;

    if (data.customDomain) {
      const parts = data.customDomain.split(".");

      if (parts.length > 2) {
        subDomain = parts[0];
        domain = parts.slice(1).join(".");

      } else {
        domain = data.customDomain;
      }
    }

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
            cycleEnd: cycleEnd,
            linksUsed: 0
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
            cycleEnd: cycleEnd,
            linksUsed: 0
          },
        });
      }

      let limit = 100;
      if (user.plan === "ESSENTIAL") limit = 10000;
      if (user.plan === "PRO") limit = 40000;

      const count = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          linksUsed: true
        }
      });

      const linksUsed = count?.linksUsed || 0;

      if (linksUsed >= limit) {
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

    const { urlShort, updatedUser } = await prisma.$transaction(async (tx) => {
      const created = await tx.link.create({
        data: {
          userId,
          original: originalLink,
          shorturl: shortUrl,
          ipAddress: ip,
          domain: domain,
          subdomain: subDomain
        },
      });

      const updated = await tx.user.update({
        where: {
          id: userId
        },
        data: {
          linksUsed: {
            increment: 1,
          },
          totalLinksCreated: {
            increment: 1
          }
        },
      });

      const cacheKey = `links-left:${userId}`;
      await redis.decr(cacheKey);

      return { urlShort: created, updatedUser: updated };
    });

    await redis.del(`fetchLinks:${userId}`);


    const count = updatedUser?.linksUsed;
    const totalCount = updatedUser?.totalLinksCreated || 0;
    const plan = updatedUser?.plan;
    let milestoneMessage = "Short URL created!";

    if (userId !== ANON_USER_ID) {
      const milestones = [1, 10, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
      const freeMilestones = [10, 30, 50, 80, 100];

      if (milestones.includes(totalCount)) {
        let title = "Link Milestone!";
        let message = `Congrats! You've created ${totalCount} links with fasturl.`;
        
        if (totalCount === 1) {
          message = "Congrats on creating your first link! Try generating a QR code next.";
        }

        await prisma.notification.create({
          data: {
            userId: userId,
            title: title,
            message: message,
            actionUrl: "/qr"
          }
        });
        milestoneMessage = message;
      }

      if (plan === "FREE" && freeMilestones.includes(count)) {
        const linksLeft = 100 - count;
        let title = "Plan Usage Update";
        let message = `You've used ${count} links this month. You have ${linksLeft} links left in your free plan.`;
        
        if (count === 100) {
          message = "You've reached your free plan limit for this month. Upgrade to continue creating links.";

        } else if (count >= 80) {
          message = `Warning: You only have ${linksLeft} links left in your free plan. Upgrade now to avoid interruption.`;
        }

        await prisma.notification.create({
          data: {
            userId: userId,
            title: title,
            message: message,
            actionUrl: "/premium"
          }
        });
        
        if (count >= 80) milestoneMessage = message;
      }

    } else {
      milestoneMessage = "Short URL created! Note: Anonymous links expire soon. Sign up to manage your links.";
    }

    return NextResponse.json({
      message: milestoneMessage,
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