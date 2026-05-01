import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Token not found" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            email: string;
        }
        const userId = decoded.userId;

        const cachedKey = `fetchBulkLinks:${userId}`
        const cachedData = await redis.get(cachedKey);
        if (cachedData) {
            const parsedData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;

            return NextResponse.json({
                message: "Bulk links fetched",
                bulkLinks: parsedData
            });

        } else {
            const bulkLinks = await prisma.bulkLinks.findMany({
                where: {
                    userId: userId
                },
                include: {
                    links: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            await redis.set(cachedKey, bulkLinks);

            return NextResponse.json(
                { message: "Bulk links fetched", bulkLinks }
            )
        }

    } catch (error) {
        return NextResponse.json(
            { message: "Error while fetching bulk links" },
            { status: 500 }
        )
    }
}