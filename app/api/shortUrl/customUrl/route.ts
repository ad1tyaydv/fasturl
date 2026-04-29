import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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
        const data = await req.json();

        if (!data.shortUrl || !data.customUrl) {
            return NextResponse.json(
                { message: "Short url or custom url are missing" },
                { status: 400 }
            );
        }

        const existing = await prisma.link.findUnique({
            where: {
                shorturl: data.customUrl,
            },
        });

        if (existing) {
            return NextResponse.json(
                { message: "Custom short url is already taken" },
                { status: 409 }
            );
        }

        const link = await prisma.link.findUnique({
            where: {
                id: data.shortUrl,
            },
        });

        if (!link) {
            return NextResponse.json(
                { message: "Link not found" },
                { status: 404 }
            );
        }

        const updated = await prisma.link.update({
            where: {
                id: data.shortUrl,
            },
            data: {
                shorturl: data.customUrl,
            },
        });

        if (link.checkBulk) {
            await redis.del(`fetchBulkLinks:${userId}`);

        } else {
            await redis.del(`fetchLinks:${userId}`);
        }

        await redis.del(`analytics:${link.shorturl}`);

        return NextResponse.json(
            { message: "Custom Url updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error while updating" },
            { status: 500 }
        );
    }
}