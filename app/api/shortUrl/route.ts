import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import shortUrlGenerator from "@/app/helpers/shortUrlGenerator";


const JWT_SECRET = process.env.AUTH_SECRET!;

export async function POST(req: NextRequest) {

    const data = await req.json();

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
            },
            select: {
                email: true,
            }
        })

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const shortUrl = shortUrlGenerator();

        const urlShort = await prisma.link.create({
            data: {
                userId: userId,
                original: data.url,
                shorturl: shortUrl!
            }
        })

        return NextResponse.json({
            message: "Short url created!",
            shortUrl: urlShort.shorturl,
            original: urlShort.original
        });


    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Can't short url right now, try again later"},
            {status: 500}
        )    
    }
}