import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
    
    try {
        const data = await req.json();

        const token = req.cookies.get("token")?.value;

        if(!token) {
            return NextResponse.json(
                {message: "User doesn't exists"},
                {status: 404}
            )
        }

        const decoded = await jwt.verify(token!, JWT_SECRET) as {
            userId: string;
        }

        await prisma.user.update({
            where: {
                id: decoded.userId
            },
            data: {
                image: data.image
            }
        })

        return NextResponse.json(
            {message: "UserName updated successfully"},
            {status: 200}
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
}