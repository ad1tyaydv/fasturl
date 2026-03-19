import { prisma } from "@/lib/dbConfig";
import { NextResponse } from "next/server";


const ANON_USER_CLICK = process.env.ANONYMOUS_USER_CLICK!;

export async function GET() {

    try {
        const totalData = await prisma.count.findUnique({
            where: {
                countId: ANON_USER_CLICK
            }
        })

        const totalLinks = totalData?.linkCount;
        const totalQrs = totalData?.qrCount;
        const totalClicks = totalLinks! + totalQrs!;

        return NextResponse.json(
            {message: "Total Data counted", totalLinks, totalQrs, totalClicks},
            {status: 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
}