import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string
        }

        const userId = decoded.userId;

        const data = await req.json();
        const { id, name } = data;
        
        await prisma.qr.update({
            where: {
                id: data.id
            },
            data: {
                qrName: data.qrName
            }
        })


        return NextResponse.json(
            { message: "QR name updated" },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: "Error while fetching data" },
            { status: 500 }
        )
    }
}