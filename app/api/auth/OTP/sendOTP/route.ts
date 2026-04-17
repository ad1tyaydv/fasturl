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
        userId: decoded.userId,
        email: decoded.email,
        otp: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await resend.emails.send({
      from: "FastURL <no-reply@fasturl.in>",
      to: [email],
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>FastURL Password Reset</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:6px;">${otp}</h1>
          <p>This OTP expires in 10 minutes.</p>
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