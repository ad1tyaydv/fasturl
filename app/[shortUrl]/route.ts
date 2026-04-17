import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { stateMap } from "../helpers/getStateName";
import { countryMap } from "../helpers/getCountryName";
import { redis } from "@/lib/redis";
import { UAParser } from "ua-parser-js";

const ANON_USER_CLICK = process.env.ANONYMOUS_USER_CLICK!;

export async function GET(req: NextRequest, { params }: { params: Promise<{ shortUrl: string }> }) {

    try {
        const { shortUrl } = await params;

        let originalUrl = await redis.get(`link:${shortUrl}`);

        const domain = req.headers.get("host");

        if (domain && !domain.includes("fasturl.in") && !domain.includes("localhost")) {
            const parts = domain.split(".");
            const subDomain = parts.length > 2 ? parts.slice(0, -2).join(".") : null;
            const rootDomain = parts.slice(-2).join(".");

            const domainExists = await prisma.customDomain.findFirst({
                where: {
                    domain: rootDomain,
                    subDomain: subDomain,
                    isActive: true,
                },
            });

            if (!domainExists) {
                return NextResponse.json(
                    { message: "Domain not configured" },
                    { status: 404 }
                );
            }
        }

        let findUrl;

        if (!originalUrl){
            findUrl = await prisma.link.findUnique({
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

            originalUrl = findUrl.original;

            await redis.set(`link:${shortUrl}`, originalUrl, {
                ex: 60 * 60 * 24,
            });

        } else {
            findUrl = await prisma.link.findUnique({
                where: {
                    shorturl: shortUrl,
                },
            });
        }

        if(findUrl?.password) {
            return NextResponse.redirect(new URL(`/verify/${shortUrl}`, req.url));
        }

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
        const country = req.headers.get("x-vercel-ip-country") || "Unknown";
        const countryFullName = countryMap[country] ?? country;

        const state = req.headers.get("x-vercel-ip-country-region") || "Unknown";
        const stateFullName = stateMap[state] ?? state;

        const city = req.headers.get("x-vercel-ip-city") || "Unknown";

        const userAgent = req.headers.get("user-agent") || "";
        const parser = new UAParser(userAgent);

        const browser = parser.getBrowser().name || "Unknown";
        const device = parser.getDevice().type || "Desktop";
        const OS = parser.getOS().name || "Unknown";

        let ref = req.headers.get("referer");
        let referrer = "Direct";

        if (ref) {
            try {
                const domain = new URL(ref).hostname.toLowerCase();

                if (domain.includes("twitter")) referrer = "Twitter";
                else if (domain.includes("facebook")) referrer = "Facebook";
                else if (domain.includes("linkedin")) referrer = "LinkedIn";
                else if (domain.includes("instagram")) referrer = "Instagram";
                else if (domain.includes("google")) referrer = "Google";
                else referrer = domain;
                
            } catch {

            }
        }

        Promise.all([
            prisma.link.update({
                where: {
                    shorturl: shortUrl,
                },
                data: {
                    clicks: {
                        increment: 1,
                    },
                },
            }),

            prisma.click.create({
                data: {
                    linkId: findUrl!.id,
                    ip,
                    country: countryFullName,
                    state: stateFullName,
                    city,
                    browser,
                    device,
                    OS,
                    referrer,
                },
            }),

            redis.del(`fetchLinks:${findUrl?.userId}`),
            redis.del(`analytics:${shortUrl}`),
        ]);

        return NextResponse.redirect(originalUrl as string);

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}