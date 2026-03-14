import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string}> } ) {

    const { id } = await params;

    try {
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while deleting the url"},
            {status: 500}
        )
    }
}