import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";


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
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user) {
            return NextResponse.json(
                {message: "Can't find user"},
                {status: 500}
            )
        }

        const urls = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                links: {
                    where: {
                        checkBulk: false
                    },
                    select: {
                        id: true,
                        shorturl: true,
                        original: true,
                        createdAt: true
                    },
                     orderBy: {
                        createdAt: "asc"
                    }
                }
            },
        })

        return NextResponse.json(
            {
                message: "All urls found",
                urls: urls?.links || []
            },
        )


    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Can't find urls right now, try again later"},
            {status: 500}
        )    
    }
}