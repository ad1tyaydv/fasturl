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
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 40px 20px; color: #000;">
      <p style="font-size: 18px; margin-bottom: 24px;">Enter this code to verify your new email address:</p>
      
      <div style="display: inline-block; background-color: #e5e5e5; padding: 15px 40px; border-radius: 8px; margin-bottom: 30px;">
        <h1 style="margin: 0; color: #83c5be; font-size: 36px; letter-spacing: 4px; font-weight: bold;">${otp}</h1>
      </div>

      <p style="font-size: 14px; color: #666; margin-top: -10px; margin-bottom: 30px;">This OTP expires in 10 minutes.</p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px auto; width: 80%;" />

      <p style="font-size: 16px; color: #000;">
        Need help? Contact us at <a href="mailto:fasturl@tutamail.com" style="color: #22c55e; text-decoration: underline;">fasturl@tutamail.com</a>.
      </p>

      <div style="margin-top: 40px;">
        <h2 style="font-size: 32px; font-weight: bold; color: #83c5be; margin: 0;">fasturl</h2>
      </div>
      
      <p style="font-size: 12px; color: #999; margin-top: 20px;">If you didn't request this change, please ignore this email.</p>
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
