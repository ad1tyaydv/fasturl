import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    await prisma.user.delete({
      where: {
        id: decoded.userId,
      },
    });

    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
    response.cookies.set("token", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { message: "Error while deleting account" },
      { status: 500 }
    );
  }
}