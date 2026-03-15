import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.AUTH_SECRET!;

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

        const clicks = await prisma.click.groupBy({
            by: ["country", "state"],
            where: {
                linkId: linkId,
            },
            _count: {
                linkId: true
            }
        })

        const formatted = clicks.map((c) => ({
            country: c.country || "Unknown",
            state: c.state || "Unknown",
            count: c._count.linkId,
        }));

        return NextResponse.json({
            message: "Analytics fetched successfully",
            countries: formatted,
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Something went wrong!"},
            {status: 500}
        )
    }
}