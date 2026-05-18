import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User with this email does not exist" },
        { status: 404 }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.oTP.create({
      data: {
        email,
        otp: otpCode,
        reason: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await resend.emails.send({
      from: "FastURL <no-reply@fasturl.in>",
      to: email,
      subject: "Reset your Fasturl password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset</h2>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">You requested a password reset for your Fasturl account. Use the OTP below to reset your password. This code is valid for 10 minutes.</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #83c5be;">${otpCode}</span>
          </div>
          <p style="font-size: 14px; color: #888; text-align: center;">If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Fasturl. All rights reserved.</p>
        </div>
      `,
    });


    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
