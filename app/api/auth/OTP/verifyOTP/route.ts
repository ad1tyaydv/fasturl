import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

  try {
    const { otp } = await req.json();

    const token = await req.cookies.get("token")?.value;

    const decoded = jwt.verify(token!, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    const email = decoded.email;

    if (!email) {
      return NextResponse.json(
        { message: "Email not found" },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { message: "OTP is required" },
        { status: 400 }
      );
    }

    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email: email,
        otp: String(otp),
        isUsed: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    await prisma.oTP.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        isUsed: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}