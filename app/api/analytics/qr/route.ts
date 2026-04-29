import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {

        const token = req.cookies.get("token")?.value;
        
        if(!token) {
            return NextResponse.json(
                {message: "Please signIn to view Analytics"},
                {status: 401}
            )
        }

        const qrId = req.nextUrl.searchParams.get("qr");
        if (!qrId) {
            return NextResponse.json(
                { message: "qrId is required" },
                { status: 400 }
            );
        }

        const qrRecord = await prisma.qr.findUnique({
            where: {
                id: qrId
            }
        });

        if (!qrRecord) {
            return NextResponse.json(
                { message: "QR code not found" },
                { status: 404 }
            );
        }

        const link = await prisma.link.findFirst({
            where: {
                shorturl: qrRecord.shortUrl,
                userId: qrRecord.userId
            }
        });

        if (!link) {
            return NextResponse.json(
                { message: "Associated link not found" },
                { status: 404 }
            );
        }

        const linkId = link.id;

        const clicks = await prisma.click.groupBy({
            by: ["country", "state"],
            where: {
                linkId: linkId,
                isQr: true,
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
                linkId: linkId,
                isQr: true
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
                linkId: linkId,
                isQr: true
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
                linkId: linkId,
                isQr: true
            },
            _count: {
                OS: true
            }
        })
        const osData = os.map((d) => ({
            os: d.OS || "Unknown",
            count: d._count.OS,
        }))


        const referrers = await prisma.click.groupBy({
            by: ["referrer"],
            where: {
                linkId: linkId,
                isQr: true
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
