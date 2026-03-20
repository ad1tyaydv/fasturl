import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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
            {message: "Not found"},
            {status: 404}
        );
    }

    if (!link.password) {
      return NextResponse.json(
        {message: "No password set"},
        {status: 400}
      );
    }

    const isMatch = await bcrypt.compare(password, link.password);

    if (!isMatch) {
      return NextResponse.json(
        {message: "Wrong password"},
        {status: 401}
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "127.0.0.1";

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
        country: "Unknown",
        state: "Unknown",
        city: "Unknown",
        browser: "Unknown",
        device: "Unknown",
        OS: "Unknown",
        referrer: "Direct",
      },
    });

    return NextResponse.json({
      success: true,
      original: link.original,
    });

  } catch (error) {
    return NextResponse.json(
        {message: "Error"}, 
        {status: 500}
    );
  }
}