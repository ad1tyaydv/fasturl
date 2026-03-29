import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {

    try {

        const token = req.cookies.get("token")?.value;
        
        if(!token) {
            return NextResponse.json(
                {message: "Please signIn to view Analytics"},
                {status: 401}
            )
        }

        const linkId = req.nextUrl.searchParams.get("linkId");

        if (!linkId) {
            return NextResponse.json(
                { message: "linkId is required" },
                { status: 400 }
            );
        }

        const bulk = await prisma.bulkLinks.findUnique({
            where: { id: linkId },
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

        const clicks = await prisma.click.groupBy({
            by: ["country", "state"],
            where: {
                linkId: {
                    in: linkIds
                }
            },
            _count: {
                linkId: true
            }
        })
        const formatted = clicks.map((a) => ({
            country: a.country || "Unknown",
            state: a.state || "Unknown",
            count: a._count.linkId,
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
        })
        const browserData = browsers.map((b) => ({
            browser: b.browser || "Unknown",
            count: b._count.browser,
        }))


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
        })
        const deviceData = devices.map((c) => ({
            devices: c.device || "Unknown",
            count: c._count.device,
        }))


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
        })
        const osData = os.map((d) => ({
            os: (d.OS || "Unknown").replace(/"/g, ""),
            count: d._count.OS,
        }))


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
            countries: formatted,
            browsers: browserData,
            devices: deviceData,
            os: osData,
            referrers: referrerData
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Something went wrong!"},
            {status: 500}
        )
    }
}