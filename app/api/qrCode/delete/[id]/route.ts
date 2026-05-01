import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";


const ANON_USER_CLICK = process.env.ANONYMOUS_USER_CLICK!;

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string}> } ) {

    const { id } = await params;

    try {

        await prisma.qr.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json(
            {message: "QR deleted successfully"},
            {status: 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while deleting the QR"},
            {status: 500}
        )
    }
}