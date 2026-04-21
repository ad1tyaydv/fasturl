import { prisma } from "@/lib/dbConfig";
import { NextResponse } from "next/server";


const ANON_USER_CLICK = process.env.ANONYMOUS_USER_CLICK!;
const COUNTID = process.env.COUNT_ID;

export async function GET() {

    try {

        const totalLinks = await prisma.link.count();
        const totalqrCodes = await prisma.qr.count();
        const totalClicks = await prisma.click.count();
        const totalUsers = await prisma.user.count();

        const currentData = await prisma.count.findFirst({
            where: {
                countId: COUNTID
            }
        })

        if (currentData?.linkCount! < totalLinks || currentData?.qrCount! < totalqrCodes || currentData?.totalClicks! < totalClicks) {
            await prisma.count.updateMany({
                where: {
                    countId: COUNTID
                },
                data: {
                    linkCount: totalLinks,
                    qrCount: totalqrCodes,
                    totalClicks: totalClicks,
                }
            })
        }

        return NextResponse.json(
            { message: "Total Data counted", totalLinks, totalqrCodes, totalClicks, totalUsers },
            { status: 200 }
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}