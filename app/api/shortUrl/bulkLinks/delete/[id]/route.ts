import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token!, JWT_SECRET) as {
      userId: string;
    }
    const userId = decoded.userId;

    const { id } = await params;

    const find = await prisma.bulkLinks.findUnique({
      where: {
        id: id
      }
    })

    if (!find) {
      return NextResponse.json(
        { message: "Bulk Link does not exist" },
        { status: 404 }
      )
    }


    await prisma.bulkLinks.deleteMany({
      where: {
        id: id
      }
    })

    await redis.del(`fetchBulkLinks:${userId}`);

    await prisma.link.deleteMany({
      where: {
        bulkLinksId: id
      }
    })

    return NextResponse.json(
      { message: "Link deleted successfully" },
      { status: 200 }
    )

  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Error while deleting the url" },
      { status: 500 }
    )
  }
}