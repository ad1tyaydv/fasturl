import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;
    
        if(!token) {
            return NextResponse.json(
                {message: "Please login first"},
                {status: 404}
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string
        }
        const userId = decoded.userId;
        
        
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                twofactorEnabled: false,
                twofactorSecret: null
            }
        })

        return NextResponse.json(
            {message: "Two factor authentication enabled"},
            {status: 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
}