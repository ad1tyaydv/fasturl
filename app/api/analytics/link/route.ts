import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                {message: "Unauthorized"},
                {status: 401}
            );
        }

        const { linkId } = await req.json();
        
        if (!linkId) {
            return NextResponse.json(
                {message: "linkId required"}, 
                {status: 400}
            );
        }
    
        const clickTimeline = await prisma.click.findMany({
            where: {
                linkId: linkId
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
            where: { linkId },
            _count: { browser: true }
        });
    
        const devices = await prisma.click.groupBy({
            by: ["device"],
            where: {
                linkId: linkId
            },
            _count: {
                device: true
            }
        });
    
        const osData = await prisma.click.groupBy({
            by: ["OS"],
            where: {
                linkId: linkId
            },
            _count: {
                OS: true
            }
        });

        const countries = await prisma.click.groupBy({
            by: ["country"],
            where: {
                linkId: linkId
            },
            _count: {
                country: true
            }
        });

        const referrers = await prisma.click.groupBy({
            by: ["referrer"],
            where: {
                linkId: linkId
            },
            _count: {
                referrer: true
            }
        });

        return NextResponse.json({
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
                os: o.OS || "Unknown",
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
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {message: "Error fetching stats"},
            {status: 500}
        );
    }
}