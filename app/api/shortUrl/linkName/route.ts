import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    
    try {
        const data = await req.json();

        const addLinkName = await prisma.link.update({
            where: {
                id: data.linkId
            },
            data: {
                linkName: data.name        
            }
        })

        return NextResponse.json(
            {message: "Link name added successfully"},
            {status: 200}
        )

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Error while adding link name"},
            {status: 500}
        )
    }
}