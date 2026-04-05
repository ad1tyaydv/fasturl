import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";


export async function GET() {

  try {
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);
    
    const expiredLinks = await prisma.link.findMany({
      where: {
        expiresAt: {
          lte: nowIST
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
          lte: nowIST
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