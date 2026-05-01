import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

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
            email: string;
        }
        const userId = decoded.userId;

        const { id } = await params;

        await prisma.link.update({
            where: {
                id: id
            },
            data: {
                redirectTo: null
            }
        })

        await redis.del(`fetchLinks:${userId}`)

        return NextResponse.json(
            { message: "Redirect to added successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error while adding link name" },
            { status: 500 }
        )
    }
}