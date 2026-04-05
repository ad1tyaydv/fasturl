import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";


export async function GET() {
    
  try {
    const now = new Date();

    const expiredLinks = await prisma.link.findMany({
      where: {
        expiresAt: {
          lte: now
        }
      },
      select: {
        shorturl: true,
        userId: true
      }
    });

    const deleted = await prisma.link.deleteMany({
      where: {
        expiresAt: {
          lte: now
        }
      }
    });

    await Promise.all(
      expiredLinks.map((link) =>
        Promise.all([
          redis.del(`fetchUrls:${link.userId}`),
          redis.del(`analytics:${link.shorturl}`),
          redis.del(`link:${link.shorturl}`),
        ])
      )
    );

    console.log(`[CRON] Deleted ${deleted.count} expired links`);

    return NextResponse.json({
      success: true,
      deleted: deleted.count
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false
    });
  }
}