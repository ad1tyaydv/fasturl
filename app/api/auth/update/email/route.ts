import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY!);

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
        const newEmail = data.email;

        if (!newEmail) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: newEmail
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "This email is already in use by another account" },
                { status: 409 }
            )
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.oTP.create({
            data: {
                email: newEmail,
                otp: otp,
                reason: "email_update",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });

        await resend.emails.send({
            from: "FastURL <no-reply@fasturl.in>",
            to: [newEmail],
            subject: "Verify your new email address",
            html: `
              <div style="font-family: Arial; padding:20px;">
                <h2>Fasturl Email Update</h2>
                <p>You requested to update your email address. Please use the following OTP to verify your new email:</p>
                <h1 style="letter-spacing:6px;">${otp}</h1>
                <p>This OTP expires in 10 minutes.</p>
                <p>If you didn't request this change, please ignore this email.</p>
              </div>
            `,
        });

        return NextResponse.json(
            { message: "OTP sent to your new email address" },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error sending email update OTP:");
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}
