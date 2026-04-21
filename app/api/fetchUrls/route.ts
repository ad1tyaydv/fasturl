import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {

    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const decoded = jwt.verify(token!, JWT_SECRET) as {
        userId: string;
        email: string;
    }
    const userId = decoded.userId;

    try {
    const cachedKey = `fetchLinks:${userId}`;
    const cachedData = await redis.get(cachedKey);

    if(cachedData) {
        return NextResponse.json(typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData);

    } else {
        const urls = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                links: {
                    where: {
                        checkBulk: false,
                        api_link: false,
                    },
                    select: {
                        id: true,
                        shorturl: true,
                        original: true,
                        linkName: true,
                        clicks: true,
                        redirectTo: true,
                        password: true,
                        createdAt: true
                    },
                     orderBy: {
                        createdAt: "asc"
                    }
                }
            },
        })

        if(!urls) {
            return NextResponse.json(
                {message: "Urls not found"},
                {status: 404}
            )
        }

        const responseData = {
            message: "All urls found",
            urls: urls?.links || []
        }

        await redis.set(cachedKey, JSON.stringify(responseData));

        return NextResponse.json(responseData);
    }

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Can't find urls right now, try again later"},
            {status: 500}
        )    
    }
}