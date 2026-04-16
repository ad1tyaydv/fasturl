import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { parse } from "tldts";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    const { domain } = await req.json();

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { message: "Domain required" },
        { status: 400 }
      );
    }

    const parsed = parse(domain);

    if (!parsed.domain) {
      return NextResponse.json(
        { message: "Invalid domain format" },
        { status: 400 }
      );
    }

    const rootDomain = parsed.domain;
    const subDomain = parsed.subdomain || null;

    const existing = await prisma.customDomain.findFirst({
      where: {
        userId: decoded.userId,
        domain: rootDomain,
        subDomain: subDomain
      }
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        verificationToken: existing.txtValue,
        cnameTarget: existing.cnameTarget,
        domain: existing.domain,
        subDomain: existing.subDomain
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const txtName = subDomain ? `_verify.${subDomain}` : `_verify`;

    const cnameTarget = "cname.fasturl.in";

    const newDomain = await prisma.customDomain.create({
      data: {
        domain: rootDomain,
        subDomain: subDomain,
        txtValue: verificationToken,
        txtName: txtName,
        txtVerified: false,
        cnameTarget: cnameTarget,
        cnameVerfied: false,
        isActive: false,
        userId: decoded.userId
      }
    });

    return NextResponse.json({
      success: true,
      verificationToken: newDomain.txtValue,
      txtName: newDomain.txtName,
      cnameTarget: newDomain.cnameTarget,
      domain: newDomain.domain,
      subDomain: newDomain.subDomain
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Error while adding domain" },
      { status: 500 }
    );
  }
}