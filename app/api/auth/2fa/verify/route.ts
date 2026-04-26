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
        
        
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                twofactorSecret: true,
                twofactorEnabled: true
            }
        })

        if(!user) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            )
        }

        const data = await req.json();

        if(user.twofactorSecret) {
            const verified = speakeasy.totp.verify({
                secret: user.twofactorSecret,
                encoding: "base32",
                token: data.otp,
                window: 1,
            })

            if(!verified) {
                return NextResponse.json(
                    {message: "Invalid OTP"},
                    {status: 400}
                )
            }

        } else {
            return NextResponse.json(
                {message: "Enable 2fa first"},
                {status: 400}
            )
        }

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                twofactorEnabled: true
            }
        })

        await prisma.notification.create({
            data: {
                userId: userId,
                title: "two factor authentication",
                message: "Your account is now more secure with two factor authentication.",
                actionUrl: "/"
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