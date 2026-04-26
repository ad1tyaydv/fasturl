import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.bulkLinkId) {
      return NextResponse.json(
        { message: "Invalid URL ID" },
        { status: 400 }
      );
    }

    let hashedPassword = null;

    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    let expiresAt = null;

    if (data.expiryDate) {
      expiresAt = new Date(data.expiryDate);
    }
    
    await prisma.link.updateMany({
      where: {
        bulkLinksId: data.bulkLinkId,
        checkBulk: true,
      },
      data: {
        password: hashedPassword,
        expiresAt: expiresAt,
      },
    });

    const linkUpdate = await prisma.bulkLinks.update({
      where: {
        id: data.bulkLinkId,
      },
      data: {
        password: hashedPassword,
        expiresAt: expiresAt,
      },
    });
    
    await redis.del(`fetchBulkLinks:${linkUpdate.userId}`);

    return NextResponse.json(
      { message: "Password Protection added" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Error while adding password protection" },
      { status: 500 }
    );
  }
}