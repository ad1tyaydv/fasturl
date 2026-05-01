import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UAParser } from "ua-parser-js";
import { stateMap } from "@/app/helpers/getStateName";
import { countryMap } from "@/app/helpers/getCountryName";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { shortUrl, password } = await req.json();

    const link = await prisma.link.findUnique({
      where: {
        shorturl: shortUrl
      },
    });

    if (!link) {
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );
    }

    if (!link.password) {
      return NextResponse.json(
        { message: "No password set" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, link.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Wrong password" },
        { status: 401 }
      );
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

    await prisma.link.update({
      where: {
        shorturl: shortUrl
      },
      data: {
        clicks: {
          increment: 1
        },
      },
    });

    await prisma.click.create({
      data: {
        linkId: link.id,
        ip,
        country: countryFullName,
        state: stateFullName,
        city: city,
        browser: browser,
        device: device,
        OS: OS,
        referrer: referrer,
      },
    });

    redis.del(`fetchLinks:${link?.userId}`);
    redis.del(`analytics:${shortUrl}`);

    return NextResponse.json({
        success: true,
        original: link.original,
      });

  } catch (error) {
    return NextResponse.json(
      { message: "Error" },
      { status: 500 }
    );
  }
}