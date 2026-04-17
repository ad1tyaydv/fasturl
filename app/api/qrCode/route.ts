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

    // ----------------- INIT CYCLE -----------------
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

    // ----------------- RESET CYCLE -----------------
    if (cycleEnd && now > new Date(cycleEnd)) {
      cycleStart = now;
      cycleEnd = add30Days(now);

      await prisma.user.update({
        where: { id: userId },
        data: {
          cycleStart,
          cycleEnd,
        },
      });
    }

    // ----------------- LIMITS -----------------
    let limit = 2;
    if (user.plan === "ESSENTIAL") limit = 200;
    if (user.plan === "PRO") limit = 2000;

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

    // ----------------- QR GENERATION -----------------
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

    const saveQR = await prisma.qr.create({
      data: {
        userId,
        longUrl: data.longUrl,
        shortUrl: data.shortUrl,
        qrImage: qr,
        ipAddress: ip,
      },
    });

    await redis.del(`qrs-left:${userId}`);

    return NextResponse.json({
      message: "QR generated successfully!",
      shortUrl: saveQR.shortUrl,
      original: saveQR.longUrl,
      qrImage: saveQR.qrImage,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}