import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token not found" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    const userId = decoded.userId;

    const linkUpdate = await prisma.link.delete({
      where: {
        id: id,
      },
    });

    const cacheKey = `fetchBulkLinks:${userId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsed = JSON.parse(cachedData as string);

      const updated = parsed.map((bulk: any) => {
        if (bulk.id === linkUpdate.bulkLinksId) {
          return {
            ...bulk,
            links: bulk.links.filter((l: any) => l.id !== id),
          };
        }
        return bulk;
      });

      await redis.set(cacheKey, JSON.stringify(updated));
    }

    return NextResponse.json(
      { message: "Link deleted" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error while deleting link" },
      { status: 500 }
    );
  }
}