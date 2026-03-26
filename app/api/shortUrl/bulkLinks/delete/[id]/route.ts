import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: {params: Promise<{ id: string }> }) {

    const { id } = await params;

    try {

        await prisma.bulkLinks.delete({
            where: {
                id: id,
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