import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
    };
    const userId = decoded.userId;

    const cachedKey = `notifications:${userId}`;
    const cachedData = await redis.get(cachedKey);

    let notifications;

    if (cachedData) {
      return NextResponse.json({
        notifications: cachedData
      });

    } else {
      notifications = await prisma.notification.findMany({
        where: {
          userId: decoded.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      await redis.set(`notifications:${userId}`, notifications);

      return NextResponse.json({
        notifications: notifications
      });
    }

  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
