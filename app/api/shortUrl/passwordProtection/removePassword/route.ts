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

        const decoded = jwt.verify(token!, JWT_SECRET) as {
            userId: string;
        }
        const userId = decoded.userId;

        const data = await req.json();

        if (!data.shortUrlId) {
            return NextResponse.json(
                { message: "Invalid URL ID" },
                { status: 400 }
            );
        }

        const find = await prisma.link.findUnique({
            where: {
                id: data.shortUrlId
            }
        })

        if (!find) {
            return NextResponse.json(
                { message: "Url does not exist" },
                { status: 404 }
            )
        }

        if (find.checkBulk === true) {
            await redis.del(`fetchBulkLinks:${userId}`);

            await prisma.link.update({
                where: {
                    id: data.shortUrlId
                },
                data: {
                    password: null,
                    expiresAt: null
                },
            })

            return NextResponse.json(
                { message: "Password Protection added" },
                { status: 200 }
            )

        } else {
            await redis.del(`fetchLinks:${userId}`)
            await redis.del(`analytics${find.shorturl}`)

            await prisma.link.update({
                where: {
                    id: data.shortUrlId
                },
                data: {
                    password: null,
                    expiresAt: null
                },
            })

            return NextResponse.json(
                { message: "Password Protection removed" },
                { status: 200 }
            )
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error while adding password protection" },
            { status: 500 }
        )
    }
}