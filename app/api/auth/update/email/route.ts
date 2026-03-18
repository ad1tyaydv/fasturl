import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
    

    try {
        const token = req.cookies.get("token")?.value;

        if(!token) {
            return NextResponse.json(
                {message: "User doesn't exists"},
                {status: 404}
            )
        }

        const decoded = jwt.verify(token!, JWT_SECRET) as {
            userId: string,
        }

        const data = await req.json();

        await prisma.user.update({
            where: {
                id: decoded.userId,
            },
            data: {
                email: data.email
            }
        })

        return NextResponse.json(
            {message: "Email updated successfully"},
            {status: 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
}