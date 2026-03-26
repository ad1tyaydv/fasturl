import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";


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

        return NextResponse.json(
            {message: "Bulk links fetched", bulkLinks}
        )

    } catch (error) {
        return NextResponse.json(
            {message: "Error while fetching bulk links"},
            {status: 500}
        )
    }
}