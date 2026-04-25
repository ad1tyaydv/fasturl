import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;
        
        if(!token) {
            return NextResponse.json(
                {message: "Please signIn to view Analytics"},
                {status: 401}
            )
        }

        const { batchId } = await req.json();

        if (!batchId) {
            return NextResponse.json(
                { message: "batchId is required" },
                { status: 400 }
            );
        }

        const bulk = await prisma.bulkLinks.findUnique({
            where: { id: batchId },
            include: {
                links: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!bulk) {
            return NextResponse.json(
                { message: "Bulk not found" },
                { status: 404 }
            );
        }

        const linkIds = bulk.links.map(link => link.id);

        const clicks = await prisma.click.findMany({
            where: {
                linkId: {
                    in: linkIds
                }
            },
            select: {
                createdAt: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        const countries = await prisma.click.groupBy({
            by: ["country"],
            where: {
                linkId: {
                    in: linkIds
                }
            },
            _count: {
                country: true
            }
        });
        const formattedCountries = countries.map((c) => ({
            country: c.country || "Unknown",
            count: c._count.country,
        }));


        const browsers = await prisma.click.groupBy({
            by: ["browser"],
            where: {
                linkId: {
                    in: linkIds
                }
            },
            _count: {
                browser: true
            }
        });
        const browserData = browsers.map((b) => ({
            browser: b.browser || "Unknown",
            count: b._count.browser,
        }));


        const devices = await prisma.click.groupBy({
            by: ["device"],
            where: {
                linkId: {
                    in: linkIds
                }
            },
            _count: {
                device: true
            }
        });
        const deviceData = devices.map((c) => ({
            device: c.device || "Unknown",
            count: c._count.device,
        }));


        const os = await prisma.click.groupBy({
            by: ["OS"],
            where: {
                linkId: {
                    in: linkIds
                }
            },
            _count: {
                OS: true
            }
        });
        const osData = os.map((d) => ({
            os: (d.OS || "Unknown").replace(/["']/g, "").trim(),
            count: d._count.OS,
        }));


        const referrers = await prisma.click.groupBy({
            by: ["referrer"],
            where: { 
                linkId: {
                    in: linkIds
                }
             },
            _count: {
                referrer: true
            }
        });
        const referrerData = referrers.map((e) => ({
            referrer: e.referrer || "Direct",
            count: e._count.referrer
        }));


        return NextResponse.json({
            message: "Analytics fetched successfully",
            clicks: clicks,
            countries: formattedCountries,
            browsers: browserData,
            devices: deviceData,
            os: osData,
            referrers: referrerData
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {message: "Something went wrong!"},
            {status: 500}
        )
    }
}


