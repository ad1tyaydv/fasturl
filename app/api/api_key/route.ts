import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";
import Api_keyGenerator from "@/lib/api_keyGenerator";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

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
        const userId = decoded.userId;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const cachedKey = `apiKeys:${userId}`
        await redis.del(cachedKey);

        const data = await req.json();

        const api_key = Api_keyGenerator();

        const tier = user.plan;
        if (tier !== "PRO") {
            return NextResponse.json(
                { message: "Only PRO plan users can create API keys" },
                { status: 403 }
            );
        }

        const maxLimit = 5000;

        const apiKey = await prisma.api_key.create({
            data: {
                userId: decoded.userId,
                key: api_key,
                name: data.name,
                isActive: true,
                usageLimit: maxLimit,
            }
        })

        return NextResponse.json({
            success: true,
            message: "Api_key generated successfully",
            api_key
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}