import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;


export async function POST(req: NextRequest) {
    try {
        const now = new Date();
        const data = await req.json();

        if (!data.email || !data.otp) {
            return NextResponse.json({ message: "Missing email or OTP" }, { status: 400 });
        }

        const validOtp = await prisma.oTP.findFirst({
            where: {
                email: data.email,
                otp: data.otp,
                reason: "signup",
                expiresAt: {
                    gt: new Date()
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!validOtp) {
            return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
        }

        await prisma.oTP.deleteMany({
            where: {
                email: data.email,
                reason: "signup"
            }
        });

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userSignup = await prisma.user.create({
            data: {
                userName: data.userName,
                email: data.email,
                password: hashedPassword,
                plan: "FREE",
                totalLinks: 100,
                linksUsed: 0,
                totalLinksCreated: 0,
                totalQr: 30,
                qrUsed: 0,
                totalQrCreated: 0,
                cycleStart: now,
                cycleEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            }
        })

        const token = jwt.sign(
            {
                userId: userSignup.id,
                username: userSignup.userName,
                email: data.email,
                plan: userSignup.plan,
                planExpiresAt: userSignup.planExpiresAt
            },
            NEXTAUTH_SECRET!,
            {
                expiresIn: "365d"
            }
        );

        const response = NextResponse.json(
            { message: "User signed up successfully", success: true },
            { status: 200 }
        )

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}