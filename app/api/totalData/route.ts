import { prisma } from "@/lib/dbConfig";
import { NextResponse } from "next/server";


export async function GET() {

    try {
        const totalLinks = await prisma.link.count();
        const totalQrs = await prisma.qr.count();
        const totalClicks = await prisma.click.count();

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