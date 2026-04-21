import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

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

    const token = req.cookies.get("token")?.value;
    const data = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Login to generate QR code" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    const userId = decoded.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();

    let cycleStart = user.cycleStart;
    let cycleEnd = user.cycleEnd;

    if (!cycleStart || !cycleEnd) {
      cycleStart =
        user.plan === "FREE"
          ? user.createdAt
          : user.planStartedAt || new Date();

      cycleEnd = add30Days(cycleStart);

      await prisma.user.update({
        where: { id: userId },
        data: { cycleStart, cycleEnd },
      });
    }

    if (cycleEnd && now > new Date(cycleEnd)) {
      cycleStart = now;
      cycleEnd = add30Days(now);

      await prisma.user.update({
        where: { id: userId },
        data: { cycleStart, cycleEnd },
      });
    }

    let limit = 30;
    if (user.plan === "ESSENTIAL") limit = 500;
    if (user.plan === "PRO") limit = 5000;

    const count = await prisma.qr.count({
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
        {
          message:
            user.plan === "FREE"
              ? "Upgrade to generate more QR codes"
              : "Plan limit reached",
        },
        { status: 429 }
      );
    }

    const fullShortUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/${data.shortUrl}`;

    const qr = await QRCode.toDataURL(fullShortUrl, {
      width: 300,
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const saveQR = await prisma.$transaction(async (tx) => {
      const created = await tx.qr.create({
        data: {
          userId,
          longUrl: data.longUrl,
          shortUrl: data.shortUrl,
          qrImage: qr,
          ipAddress: ip,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          totalQr: {
            decrement: 1,
          },
        },
      });

      return created;
    });

    const cachedKey = `qrs-left:${userId}`;
    const cachedData = await redis.get(cachedKey);
    if(!cachedData) {
      await redis.set(cachedKey, user.totalQr);
    }
    await redis.decr(cachedKey);

    return NextResponse.json({
      message: "QR generated successfully!",
      shortUrl: saveQR.shortUrl,
      original: saveQR.longUrl,
      qrImage: saveQR.qrImage,
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}