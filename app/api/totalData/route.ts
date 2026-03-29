import { prisma } from "@/lib/dbConfig";
import { NextResponse } from "next/server";


const ANON_USER_CLICK = process.env.ANONYMOUS_USER_CLICK!;

export async function GET() {

    try {

        const totalLinks = await prisma.link.count();
        const totalClicks = await prisma.click.count();
        const totalUsers = await prisma.user.count();

        return NextResponse.json(
            {message: "Total Data counted", totalLinks, totalClicks, totalUsers},
            {status: 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
}