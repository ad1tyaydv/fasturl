import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

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
                planStartedAt: true,
                planExpiresAt: true
            }
        })

        if(!user) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            )
        }

        const currentUsageCount = await prisma.qr.count({
            where: {
                userId: userId,
                createdAt: {
                    gte: user.planStartedAt ? new Date(user.planStartedAt) : new Date(0)
                }
            }
        })

        const planLimits: Record<string, number> = {
            "FREE": 2,
            "ESSENTIAL": 200,
            "PRO": 2000,
        };
        
        const limit = planLimits[user.plan] || 20;

        let qrLeft = Math.max(0, limit - currentUsageCount);


        const expiresAt = user.planExpiresAt 
                         ? new Date(user.planExpiresAt).getTime()
                         : Date.now() + 7 * 24 * 60 * 60 * 1000;

        const seconds = Math.floor((expiresAt - Date.now()) / 1000);
        
        await redis.set(cachedKey, qrLeft);

        return NextResponse.json(
            {message: "Links left", qrLeft}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while fetching data"},
            {status: 500}
        )
    }
}