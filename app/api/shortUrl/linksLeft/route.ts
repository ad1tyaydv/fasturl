import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import { use } from "react";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if(!token) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 500}
            )
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string
        }

        const userId = decoded.userId;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                links: true,
                plan: true
            }
        })

        if(!user) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 500}
            )
        }

        let linksCount = user?.links.length;
        let linksLeft = 0;

        if(user.plan === "FREE") {
            linksLeft = 20 - linksCount;

        } else if(user.plan === 'ESSENTIAL') {
            linksLeft = 20000 - linksCount;

        } else {
            linksLeft = 40000 - linksCount;
        }

        return NextResponse.json(
            {message: "Links left", linksLeft}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while fetching data"},
            {status: 500}
        )
    }
}