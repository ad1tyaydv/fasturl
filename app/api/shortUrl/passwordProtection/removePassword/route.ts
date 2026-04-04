import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
            },
            select: {
                shorturl: true
            }
        })
    
        if(!find) {
            return NextResponse.json(
                {message: "User does not exist"},
                {status: 404}
            )
        }
    
        await redis.del(`fetchLinks:${userId}`)
        await redis.del(`analytics${find.shorturl}`)

        let hashedPassword = null;

        if(data.password) {
            hashedPassword = await bcrypt.hash(data.password, 10);
        }

        const expiresAt = new Date(data.expiryDate);

        await prisma.link.update({
            where: {
                id: data.shortUrlId
            },
            data: {
                password: hashedPassword,
                expiresAt: expiresAt
            },
        })

        return NextResponse.json(
            {message: "Password Protection added"},
            {status: 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while adding password protection"},
            {status: 500}
        )
    }
}