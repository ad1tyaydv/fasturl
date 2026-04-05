import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import { prisma } from "@/lib/dbConfig";


export async function POST(req: NextRequest) {

    try {
        const data = await req.json();

        const user = await prisma.user.findUnique({
            where: {
                email: data.email
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

        if(user.twofactorSecret) {
            const verified = speakeasy.totp.verify({
                secret: user.twofactorSecret,
                encoding: "base32",
                token: data.otp,
                window: 1,
            })

            if(!verified) {
                return NextResponse.json(
                    {message: "Invalid OTP", success: false},
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
                email: data.email
            },
            data: {
                twofactorEnabled: true
            }
        })

        return NextResponse.json(
            {success: true, message: "Two factor authentication verified"},
            {status: 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
}