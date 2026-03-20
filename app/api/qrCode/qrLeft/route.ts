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
                qr: true,
                plan: true
            }
        })

        if(!user) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 500}
            )
        }

        let count = user?.qr.length;
        let qrLeft = 0;

        if(user.plan === "FREE") {
            qrLeft = 2 - count;

        } else if(user.plan === 'ESSENTIAL') {
            qrLeft = 200 - count;

        } else {
            qrLeft = 2000 - count;
        }

        return NextResponse.json(
            {message: "QR left", qrLeft}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while fetching data"},
            {status: 500}
        )
    }
}