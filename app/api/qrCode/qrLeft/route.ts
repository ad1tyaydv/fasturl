import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

function add30Days(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 30);
  return d;
}

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if(!token) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 401}
            )
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string
        }

        const userId = decoded.userId;

        const cachedKey = `qrs-left:${userId}`;
        const cached = await redis.get(cachedKey);
        if(cached !== null) {
            return NextResponse.json({
                message: "qr left (cached)",
                qrLeft: cached
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                plan: true,
                cycleStart: true,
                cycleEnd: true,
                createdAt: true,
                planStartedAt: true,
            }
        })

        if(!user) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            )
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

        const currentUsageCount = await prisma.qr.count({
            where: {
                userId: userId,
                createdAt: {
                    gte: cycleStart,
                    lt: cycleEnd,
                }
            }
        })

        const planLimits: Record<string, number> = {
            "FREE": 30,
            "ESSENTIAL": 300,
            "PRO": 2000,
        };
        
        const limit = planLimits[user.plan] || 30;

        let qrLeft = Math.max(0, limit - currentUsageCount);

        const seconds = Math.floor((new Date(cycleEnd!).getTime() - Date.now()) / 1000);
        
        await redis.set(cachedKey, qrLeft, { ex: seconds });

        return NextResponse.json(
            {message: "QR left", qrLeft}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while fetching data"},
            {status: 500}
        )
    }
}