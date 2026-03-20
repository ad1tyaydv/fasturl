import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import shortUrlGenerator from "@/app/helpers/shortUrlGenerator";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;
const ANON_USER_ID = process.env.ANONYMOUS_USER_ID!;
const ANON_USER_CLICK = process.env.ANONYMOUS_USER_CLICK!;

export async function POST(req: NextRequest) {

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await req.json();
    const token = req.cookies.get("token")?.value;

    let userId: string;
    let count: number = 0;
    let decoded;
    let urlAlreadyExists = null;

    if (!token) {
      userId = ANON_USER_ID;

      count = await prisma.link.count({
        where: {
          ipAddress: ip,
          userId: ANON_USER_ID,
          createdAt: {
            gte: today
          }
        }
      });

      if (count >= 1) {
        return NextResponse.json(
          { message: "Anonymous users can only create 1 link every day" },
          { status: 429 }
        );
      }

    } else {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
      };
      userId = decoded.userId;

      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          email: true
        },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded?.userId
      }
    })


    if (token && user) {
      if (user.plan === "FREE") {
        count = await prisma.link.count({
          where: {
            userId: userId,
            createdAt: {
              gte: today
            }
          }
        });

        if (count >= 20) {
          return NextResponse.json(
            { message: "Upgrade to generate up to 40,000 URLs every month" },
            { status: 429 }
          );
        }

      } else if (user.plan === "ESSENTIAL") {
        if (user.planExpiresAt && user.planExpiresAt < today) {
          return NextResponse.json(
            { message: "Your ESSENTIAL plan has expired. Upgrade to continue" },
            { status: 403 }
          );
        }

        count = await prisma.link.count({
          where: {
            userId: userId,
            createdAt: {
              gte: today
            }
          }
        });

        if (count >= 20000) {
          return NextResponse.json(
            { message: "Upgrade to generate up to 40,000 URLs every month" },
            { status: 429 }
          );
        }

      } else {
        count = await prisma.link.count({
          where: {
            userId: userId,
            createdAt: {
              gte: today
            }
          }
        });

        if (count >= 40000) {
          return NextResponse.json(
            { message: "Upgrade again to generate up to 40,000 URLs every month" },
            { status: 429 }
          );
        }
      }
    }

    const shortUrl = shortUrlGenerator();

    const urlShort = await prisma.link.create({
      data: {
        userId: userId,
        original: data.url,
        shorturl: shortUrl,
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      message: "Short URL created!",
      shortUrl: urlShort.shorturl,
      original: urlShort.original,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't shorten URL right now, try again later" },
      { status: 500 }
    );
  }
}