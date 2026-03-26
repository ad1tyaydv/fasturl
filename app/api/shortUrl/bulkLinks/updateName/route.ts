import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    try {
        const data = await req.json();

        await prisma.bulkLinks.update({
            where: {
                id: data.linkId,
            },
            data: {
                name: data.name,
            }
        })

        return NextResponse.json(
            {message: "Bulk link deleted"},
            {status: 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message: "Error while deleting bulk links"},
            {status: 500}
        )
    }
}