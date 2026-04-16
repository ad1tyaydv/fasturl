import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

  try {
    const data = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (!user) {
      return NextResponse.json(
        {message: "User not found"},
        {status: 404}
      );
    }

    if (!user.twofactorSecret || !user.twofactorEnabled) {
      return NextResponse.json(
        {message: "2FA not enabled"},
        {status: 400}
      );
    }

    const verified = speakeasy.totp.verify({
      secret: user.twofactorSecret,
      encoding: "base32",
      token: data.otp,
      window: 1,
    });

    if (!verified) {
      return NextResponse.json(
        {message: "Invalid OTP", success: false},
        {status: 400}
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
    },
      JWT_SECRET,
      {
        expiresIn: "7d"
    }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Two factor authentication verified",
        user
      },
      {status: 200}
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      {message: "Something went wrong"},
      {status: 500}
    );
  }
}