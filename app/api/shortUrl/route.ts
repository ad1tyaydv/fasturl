import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import shortUrlGenerator from "@/app/helpers/shortUrlGenerator";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;
const ANON_USER_ID = process.env.ANONYMOUS_USER_ID!;

export async function POST(req: NextRequest) {

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const data = await req.json();
    const token = req.cookies.get("token")?.value;

    let userId: string;
    let count: number = 0;

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

      } else {
          const urlAlreadyExists = await prisma.link.findFirst({
            where: {
                original: data.url
            },
            select: {
                shorturl: true,
                original: true,
            }
        })

        if(urlAlreadyExists) {
            return NextResponse.json({
                message: "Short URL already exists",
                shortUrl: urlAlreadyExists.shorturl,
                original: urlAlreadyExists.original
            });
        }
      }

    } else {
      const decoded = jwt.verify(token, JWT_SECRET) as {
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

      count = await prisma.link.count({
        where: {
          userId: userId,
          createdAt: {
            gte: today
          }
        }
      });

      if(count >= 2) {
        return NextResponse.json(
          {message: "Upgrade to generate unlimited urls every month"},
          {status: 429}
        )
      }

      const urlAlreadyExists = await prisma.link.findFirst({
          where: {
              original: data.url
          },
          select: {
              shorturl: true,
              original: true,
          }
      })

      if(urlAlreadyExists) {
          return NextResponse.json({
              message: "Short URL already exists",
              shortUrl: urlAlreadyExists.shorturl,
              original: urlAlreadyExists.original
          });
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