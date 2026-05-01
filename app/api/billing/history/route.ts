import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const JWT_SECRET = process.env.NEXTAUTH_SECRET;

    if (!token || !JWT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const payments = await prisma.payment.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching billing" }, { status: 500 });
  }
}