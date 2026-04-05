import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";
import cron from "node-cron";


cron.schedule("*/5 * * * *", async () => {
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
        })

        await Promise.all(
            expiredLinks.map((link) =>
                Promise.all([
                    redis.del(`fetchUrls:${link.userId}`),
                    redis.del(`analytics:${link.shorturl}`),
                    redis.del(`link:${link.shorturl}`),
                ])
            )
        )

        console.log(`[CRON] Deleted ${deleted.count} expired links at ${new Date().toISOString()}`);

    } catch (error) {
        console.log("Error deleting expired Links", error);
    }
})