import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    try {
        const data = await req.json();

        if(!data.shortUrl || !data.customUrl) {
            return NextResponse.json(
                {message: "Short url or custom url are missing"},
                {status: 404}
            )
        }

        const checkShortUrlExists = await prisma.link.findUnique({
            where: {
                shorturl: data.customUrl
            }
        })

        if(checkShortUrlExists) {
            return NextResponse.json(
                {message: "Custom short url is already taken"},
                {status: 409}
            )
        }

        await prisma.link.update({
            where: {
                id: data.shortUrl,
            },
            data: {
                shorturl: data.customUrl
            }
        })

        return NextResponse.json(
            {message: "Custom Url updated successfully"},
            {status: 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message: "Error while updating"},
            {status: 500}
        )    
    }
}