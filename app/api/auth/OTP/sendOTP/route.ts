import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {

  try {
    const token = await req.cookies.get("token")?.value;

    const decoded = jwt.verify(token!, JWT_SECRET) as {
      userId: string;
      email: string;
    }
    const email = decoded.email;

    if (!email) {
      return NextResponse.json(
        { message: "No email found in cookies" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.oTP.create({
      data: {
        email: decoded.email,
        otp: otp,
        reason: "password reset",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await resend.emails.send({
      from: "FastURL <no-reply@fasturl.in>",
      to: [email],
      subject: "Password Reset OTP",
      html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 40px 20px; color: #000;">
      <p style="font-size: 18px; margin-bottom: 24px;">Enter this code to reset your password:</p>
      
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
    </div>
    `,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent to email",
      email
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}