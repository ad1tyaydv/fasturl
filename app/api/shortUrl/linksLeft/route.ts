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

        const cacheKey = `links-left:${userId}`;
        const cached = await redis.get(cacheKey);
        if(cached !== null) {
            return NextResponse.json({
                message: "Links left (cached)",
                linksLeft: cached
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
              cycleStart, 
              cycleEnd,
              linksUsed: 0
            },
          });
        }

        const currentUsageCount = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                linksUsed: true,
            }
        })

        const planLimits: Record<string, number> = {
            "FREE": 100,
            "ESSENTIAL": 10000,
            "PRO": 40000,
        };
        
        const limit = planLimits[user.plan] || 100;

        const linksUsed = currentUsageCount?.linksUsed ?? 0;
        let linksLeft = limit - linksUsed;

        const seconds = Math.floor((new Date(cycleEnd!).getTime() - Date.now()) / 1000);
        
        await redis.set(cacheKey, linksLeft, { ex: seconds });

        return NextResponse.json(
            {message: "Links left", linksLeft}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while fetching data"},
            {status: 500}
        )
    }
}