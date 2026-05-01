import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

  try {
    const token = await req.cookies.get("token")?.value;

    const decoded = jwt.verify(token!, JWT_SECRET) as {
        userId: string;
    }

    await prisma.user.delete({
        where: {
            id: decoded.userId
        }
    })

    return NextResponse.json(
        {message: "Account deleted successfully"},
        {status: 200}
    )

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {message: "Error while deleting account"},
      {status: 500}
    );
  }
}