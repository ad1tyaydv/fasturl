import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                {message: "Unauthorized"},
                {status: 401}
            );
        }

        const { linkId, days } = await req.json();
        
        if (!linkId) {
            return NextResponse.json(
                {message: "linkId required"},
                {status: 400}
            );
        }

        const search = await prisma.link.findUnique({
            where: {
                id: linkId,
            },
        })
        const shortUrl = search?.shorturl;

        const analyticsDays = days || 7;
        const cachedKey = `analytics:${shortUrl}:${analyticsDays}`;
        const cachedData = await redis.get(cachedKey);

        if(cachedData) {
            return NextResponse.json(typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData);

        } else {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - analyticsDays);
            startDate.setHours(0, 0, 0, 0);

            const clickTimeline = await prisma.click.findMany({
                where: {
                    linkId: linkId,
                    createdAt: {
                        gte: startDate
                    }
                },
                select: {
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
        
            const browsers = await prisma.click.groupBy({
                by: ["browser"],
                where: {
                    linkId: linkId,
                    createdAt: {
                        gte: startDate
                    }
                },
                _count: {
                    browser: true
                }
            });
        
            const devices = await prisma.click.groupBy({
                by: ["device"],
                where: {
                    linkId: linkId,
                    createdAt: {
                        gte: startDate
                    }
                },
                _count: {
                    device: true
                }
            });
        
            const osData = await prisma.click.groupBy({
                by: ["OS"],
                where: {
                    linkId: linkId,
                    createdAt: {
                        gte: startDate
                    }
                },
                _count: {
                    OS: true
                }
            });

            const countries = await prisma.click.groupBy({
                by: ["country"],
                where: {
                    linkId: linkId,
                    createdAt: {
                        gte: startDate
                    }
                },
                _count: {
                    country: true
                }
            });

            const referrers = await prisma.click.groupBy({
                by: ["referrer"],
                where: {
                    linkId: linkId,
                    createdAt: {
                        gte: startDate
                    }
                },
                _count: {
                    referrer: true
                }
            });

            const responseData = {
                clicks: clickTimeline,
                browsers: browsers.map(b => ({
                    browser: b.browser || "Unknown",
                    count: b._count.browser
                })),

                devices: devices.map(d => ({
                    device: d.device || "Unknown",
                    count: d._count.device
                })),

                os: osData.map(o => ({
                    os: (o.OS || "Unknown").replace(/["']/g, "").trim(),
                    count: o._count.OS
                })),
                
                countries: countries.map(c => ({
                    country: c.country || "Unknown",
                    count: c._count.country
                })),

                referrers: referrers.map(r => ({
                    referrer: r.referrer || "Direct",
                    count: r._count.referrer
                }))
            };

            await redis.set(cachedKey, JSON.stringify(responseData));
            return NextResponse.json(responseData)
        }


    } catch (error) {
        return NextResponse.json(
            {message: "Error fetching stats"},
            {status: 500}
        );
    }
}