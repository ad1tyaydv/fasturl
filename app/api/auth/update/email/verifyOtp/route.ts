import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "User doesn't exists" },
                { status: 404 }
            )
        }

        const decoded = jwt.verify(token!, JWT_SECRET) as {
            userId: string,
        }

        const data = await req.json();
        const { email, otp } = data;

        if (!email || !otp) {
            return NextResponse.json(
                { message: "Email and OTP are required" },
                { status: 400 }
            )
        }

        const otpRecord = await prisma.oTP.findFirst({
            where: {
                email: email,
                otp: otp,
                reason: "email_update",
                isUsed: false,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!otpRecord) {
            return NextResponse.json(
                { message: "Invalid or expired OTP" },
                { status: 400 }
            )
        }

        await prisma.oTP.update({
            where: {
                id: otpRecord.id
            },
            data: {
                isUsed: true
            }
        });

        await prisma.user.update({
            where: {
                id: decoded.userId
            },
            data: {
                email: email
            }
        });

        return NextResponse.json(
            { message: "Email updated successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error verifying email update OTP:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}
