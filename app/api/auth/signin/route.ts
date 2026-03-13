
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.AUTH_SECRET!;

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {

    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.password) {
        return NextResponse.json(
            { message: "User has no password set" },
            { status: 400 }
        );
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {message: "Invalid password"},
        {status: 401}
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      { message: "User logged in successfully" },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      {message: "Error while logging in", error},
      { status: 500 }
    );
  }
}