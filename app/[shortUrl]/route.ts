import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { stateMap } from "../helpers/getStateName";

export async function GET(req: NextRequest, { params } : { params: Promise<{ shortUrl: string}> }) {
    
    const { shortUrl } = await params;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
        
    const country = req.headers.get("x-vercel-ip-country") || "Unknown";

    const state = req.headers.get("x-vercel-ip-country-region") || "Unknown";
    const stateFullNames = stateMap[state] ?? state;

    const city = req.headers.get("x-vercel-ip-city") || "Unknown";

    let getBrowser = req.headers.get("sec-ch-ua");
    let browser = "Unknown";

    if (getBrowser) {
        if (getBrowser.includes("Brave")) browser = "Brave";
        else if (getBrowser.includes("Chrome")) browser = "Chrome";
        else if (getBrowser.includes("Chromium")) browser = "Chromium";
        else if (getBrowser.includes("Firefox")) browser = "Firefox";
        else if (getBrowser.includes("Safari")) browser = "Safari";
    }

    const deviceCheck = req.headers.get("sec-ch-ua-mobile");
    const device = deviceCheck === "?1" ? "Mobile" : "Desktop";

    const operatingSystem = req.headers.get("sec-ch-ua-platform");


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

    await prisma.click.create({
        data: {
            linkId: findUrl.id,
            ip: ip,
            country: country,
            state: stateFullNames,
            city: city,
            browser: browser,
            device: device,
            OS: operatingSystem,
            referrer: req.headers.get("referer") || "Direct",
        }
    })

    return NextResponse.redirect(findUrl.original);
}