import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { redis } from "@/lib/redis";
import { verifiedRateLimit } from "@/lib/rateLimit";


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
      cycleStart =
        user.plan === "FREE"
          ? user.createdAt
          : user.planStartedAt || new Date();

      cycleEnd = add30Days(cycleStart);

      await prisma.user.update({
        where: { id: userId },
        data: { 
          cycleStart, 
          cycleEnd,
          qrUsed: 0
        },
      });
    }

    if (cycleEnd && now > new Date(cycleEnd)) {
      cycleStart = now;
      cycleEnd = add30Days(now);

      await prisma.user.update({
        where: { id: userId },
        data: { 
          cycleStart, 
          cycleEnd,
          qrUsed: 0
        },
      });
    }

    let limit = 30;
    if (user.plan === "ESSENTIAL") limit = 300;
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

    const { saveQR, updatedUser } = await prisma.$transaction(async (tx) => {
      const created = await tx.qr.create({
        data: {
          userId,
          longUrl: data.longUrl,
          shortUrl: data.shortUrl,
          qrImage: qr,
          ipAddress: ip,
        },
      });

      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          qrUsed: {
            increment: 1,
          },
          totalQrCreated: {
            increment: 1
          }
        },
      });

      return { saveQR: created, updatedUser: updated };
    });

    const cachedKey = `qrs-left:${userId}`;
    const cachedData = await redis.get(cachedKey);
    if(!cachedData) {
      await redis.set(cachedKey, user.totalQr);
    }
    await redis.decr(cachedKey);


    const qrCount = updatedUser?.qrUsed;
    const totalCount = updatedUser?.totalQrCreated || 0;
    const plan = updatedUser?.plan;
    let milestoneMessage = "QR generated successfully!";

    const milestones = [1, 10, 50, 100, 250, 500, 1000];
    const freeMilestones = [5, 10, 20, 25, 30];

    if (milestones.includes(totalCount)) {
      let title = "QR Milestone!";
      let message = `Congrats! You've created ${totalCount} QR codes with FastURL.`;
      
      if (totalCount === 1) {
        message = "Congrats on creating your first QR code!";
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

    if (plan === "FREE" && freeMilestones.includes(qrCount)) {
      const qrLeft = 30 - qrCount;
      let title = "QR Usage Update";
      let message = `You've used ${qrCount} QR codes this month. You have ${qrLeft} QR codes left in your free plan.`;
      
      if (qrCount === 30) {
        message = "You've reached your free plan QR limit for this month. Upgrade to continue generating QR codes.";

      } else if (qrCount >= 25) {
        message = `Warning: You only have ${qrLeft} QR codes left in your free plan. Upgrade now to avoid interruption.`;
      }

      await prisma.notification.create({
        data: {
          userId: userId,
          title: title,
          message: message,
          actionUrl: "/premium"
        }
      });
      
      if (qrCount >= 25) milestoneMessage = message;
    }

    return NextResponse.json({
      message: milestoneMessage,
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