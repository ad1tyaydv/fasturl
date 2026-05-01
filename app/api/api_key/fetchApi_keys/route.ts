import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
        };

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });
        const userId = decoded.userId;

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const cachedKey = `apiKeys:${userId}`;
        const cachedData = await redis.get(cachedKey);

        let apiKeys;

        if (cachedData) {
            return NextResponse.json({
                message: "Api_keys fetched successfully",
                apiKeys: cachedData
            });

        } else {
            apiKeys = await prisma.api_key.findMany({
                where: {
                    userId: decoded.userId
                },
                select: {
                    id: true,
                    name: true,
                    key: true,
                    createdAt: true,
                    isActive: true,
                    usageCount: true,
                    usageLimit: true
                }
            })

            await redis.set(cachedKey, JSON.stringify(apiKeys));

            return NextResponse.json(
                { message: "Api_keys fetched successfully", apiKeys },
                { status: 200 }
            );
        }

    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}