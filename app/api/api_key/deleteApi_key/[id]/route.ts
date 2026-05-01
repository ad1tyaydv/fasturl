import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
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
        await redis.del(cachedKey);

        const { id } = await params;

        await prisma.api_key.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json(
            {message: "Api_key deleted successfully",},
            {status: 200}
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}