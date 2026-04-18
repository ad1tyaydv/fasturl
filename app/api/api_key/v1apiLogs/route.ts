import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";


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

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const apiLogs = await prisma.api_key.findMany({
            where: {
                userId: decoded.userId
            },
            select: {
                apiLogs: true
            }
        })


        return NextResponse.json(
            {message: "Api Logs fetched successfully", apiLogs},
            {status: 200}
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}