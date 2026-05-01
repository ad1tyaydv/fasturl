import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.email || !data.password) {
      return NextResponse.json(
        {message: "All fields are required"},
        {status: 400}
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        {message: "Invalid email or password"},
        {status: 401}
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {message: "Invalid password"},
        {status: 401}
      );
    }

    if (user.twofactorEnabled) {
      return NextResponse.json(
        {
          message: "2FA required",
          user,
          twofactorRequired: true
        },
        {status: 200}
      );
    }

    const token = jwt.sign(
      {
        userId: user.id, 
        email: user.email
      },
      JWT_SECRET,
      {expiresIn: "7d"}
    );

    const response = NextResponse.json(
      {message: "User logged in successfully", user},
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
      {message: "Error while logging in", error},
      {status: 500}
    );
  }
}