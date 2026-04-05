import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { stateMap } from "../helpers/getStateName";
import { countryMap } from "../helpers/getCountryName";
import { redis } from "@/lib/redis";


const ANON_USER_CLICK = process.env.ANONYMOUS_USER_CLICK!;

export async function GET(req: NextRequest, { params }: { params: Promise<{ shortUrl: string }> }) {
    
    const { shortUrl } = await params;
    
    const cachedUrl = await redis.get(`link:${shortUrl}`);
    
    if(cachedUrl) {

        await redis.del(`analytics:${shortUrl}`)

        const domain = req.headers.get("host");
        console.log("Request from domain:", domain);

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "127.0.0.1";

        const country = req.headers.get("x-vercel-ip-country") || "Unknown";
        const countryFullName = countryMap[country] ?? country;

        const state = req.headers.get("x-vercel-ip-country-region") || "Unknown";
        const stateFullName = stateMap[state] ?? state;

        const city = req.headers.get("x-vercel-ip-city") || "Unknown";

        let getBrowser = req.headers
            .get("sec-ch-ua")
            ?.replace(/"/g, "");
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

        const operatingSystem =
            req.headers.get("sec-ch-ua-platform");

        let ref = req.headers.get("referer");
        let referrer = "Direct";

        if (ref) {
            try {
            const domain = new URL(ref).hostname.toLowerCase();

            if (domain.includes("twitter")) referrer = "Twitter";
            else if (domain.includes("facebook"))
                referrer = "Facebook";
            else if (domain.includes("linkedin"))
                referrer = "LinkedIn";
            else if (domain.includes("instagram"))
                referrer = "Instagram";
            else if (domain.includes("google"))
                referrer = "Google";
            else referrer = domain;
            } catch {}
        }

        const start = Date.now();

        const findUrl = await prisma.link.findUnique({
            where: {
                shorturl: shortUrl,
            },
        });

        if (!findUrl) {
            return NextResponse.json(
                { message: "URL not found" },
                { status: 404 }
            );
        }

        if (findUrl.password) {
            return NextResponse.redirect(
                new URL(`/verify/${shortUrl}`, req.url)
            );
        }

        const update = await prisma.link.update({
            where: {
                shorturl: shortUrl,
            },
            data: {
                clicks: {
                    increment: 1,
                },
            },
        });

        await redis.del(`fetchLinks:${update.userId}`)

        await prisma.click.create({
            data: {
            linkId: findUrl.id,
            ip,
            country: countryFullName,
            state: stateFullName,
            city,
            browser,
            device,
            OS: operatingSystem,
            referrer,
            },
        });

        return NextResponse.redirect(cachedUrl as string);
    }


    if (!cachedUrl) {
        const domain = req.headers.get("host");
        console.log("Request from domain:", domain);

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "127.0.0.1";

        const country = req.headers.get("x-vercel-ip-country") || "Unknown";
        const countryFullName = countryMap[country] ?? country;

        const state = req.headers.get("x-vercel-ip-country-region") || "Unknown";
        const stateFullName = stateMap[state] ?? state;

        const city = req.headers.get("x-vercel-ip-city") || "Unknown";

        let getBrowser = req.headers
            .get("sec-ch-ua")
            ?.replace(/"/g, "");
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

        let ref = req.headers.get("referer");
        let referrer = "Direct";

        if (ref) {
            try {
                const domain = new URL(ref).hostname.toLowerCase();

                if (domain.includes("twitter")) referrer = "Twitter";
                else if (domain.includes("facebook"))
                    referrer = "Facebook";
                else if (domain.includes("linkedin"))
                    referrer = "LinkedIn";
                else if (domain.includes("instagram"))
                    referrer = "Instagram";
                else if (domain.includes("google"))
                    referrer = "Google";
                else referrer = domain;

            } catch {}
        }

        const start = Date.now();

        const findUrl = await prisma.link.findUnique({
            where: {
                shorturl: shortUrl,
            },
        });

        if (!findUrl) {
            return NextResponse.json(
                { message: "URL not found" },
                { status: 404 }
            );
        }

        await redis.set(`link:${shortUrl}`, findUrl.original,{ ex: 60 * 60 * 24 });

        if (findUrl.password) {
            return NextResponse.redirect(
                new URL(`/verify/${shortUrl}`, req.url)
            );
        }

        await prisma.link.update({
            where: {
                shorturl: shortUrl,
            },
            data: {
                clicks: {
                    increment: 1,
                },
            },
        });

        await prisma.click.create({
            data: {
            linkId: findUrl.id,
            ip,
            country: countryFullName,
            state: stateFullName,
            city,
            browser,
            device,
            OS: operatingSystem,
            referrer,
            },
        });

        return NextResponse.redirect(
            findUrl.original
        );
    }
}