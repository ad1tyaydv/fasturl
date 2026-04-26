import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  try {

    const linkUpdate = await prisma.bulkLinks.delete({
      where: {
        id: id,
      },
    });

    await redis.del(`fetchBulkLinks:${linkUpdate.userId}`);

    return NextResponse.json(
      {message: "Link deleted"},
      {status: 200}
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error while deleting link" },
      { status: 500 }
    );

  }
}