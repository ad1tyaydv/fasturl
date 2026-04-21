import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortUrl: string }> }
) {
  try {
    const { shortUrl } = await params;

    const link = await prisma.link.findUnique({
      where: {
        shorturl: shortUrl,
      },
    });

    if (!link) {
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      url: link.original,
      RedirectTo: link.redirectTo,
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Error" },
      { status: 500 }
    );
  }
}