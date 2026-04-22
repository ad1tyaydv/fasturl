import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };
    const userId = decoded.userId;

    const domain = await prisma.customDomain.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!domain) {
      return NextResponse.json(
        { message: "Domain not found" },
        { status: 404 }
      );
    }

    const fullDomain = domain.subDomain? `${domain.subDomain}.${domain.domain}` : domain.domain;


    try {
      await fetch(
        `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${fullDomain}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          },
        }
      );

      console.log("Deleted from Vercel:", fullDomain);

    } catch (error) {
      console.log("Vercel delete failed:", error);
    }

    await prisma.customDomain.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Domain deleted successfully" },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      { message: "Error while deleting domain" },
      { status: 500 }
    );
  }
}