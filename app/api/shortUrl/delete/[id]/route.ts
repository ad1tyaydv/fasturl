import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string}> } ) {

    const { id } = await params;

    try {

        await prisma.click.deleteMany({
            where: {
                linkId: id
            }
        })

        await prisma.link.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json(
            {message: "Link deleted successfully"},
            {status: 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while deleting the url"},
            {status: 500}
        )
    }
}