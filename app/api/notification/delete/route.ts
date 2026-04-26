import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, deleteAll } = await req.json();

    if (deleteAll) {
      await prisma.notification.deleteMany({
        where: {
          userId: decoded.userId,
        },
      });
      return NextResponse.json({ message: "All notifications deleted" });
    }

    if (!id) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    await prisma.notification.delete({
      where: {
        id: id,
        userId: decoded.userId,
      },
    });

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
