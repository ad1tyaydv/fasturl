import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params } : { params: Promise<{ shortUrl: string}> }) {
    
    const { shortUrl } = await params;

    const findUrl = await prisma.link.findUnique({
        where: {
            shorturl: shortUrl
        }
    })

    if(!findUrl) {
        return NextResponse.json(
            {message: "URL not found"},
            {status: 404}
        )
    }

    await prisma.link.update({
        where: {
            shorturl: shortUrl
        },
        data: {
            clicks: {
                increment: 1
            }
        }
    })

    return Response.redirect(findUrl.original);
}