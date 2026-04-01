import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if(!token) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            )
        }
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
        };

        const { domain: fullDomain } = await req.json();

        const parts = fullDomain.split(".");
        if (parts.length < 2) {
            return NextResponse.json(
                { message: "Invalid domain format" },
                { status: 400 }
            );
        }

        const subDomain = parts.length > 2 ? parts.slice(0, parts.length - 2).join(".") : "";
        const rootDomain = parts.slice(-2).join(".");

        const existing = await prisma.customDomain.findUnique({
            where: {
                domain: fullDomain
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

        const verificationToken = crypto.randomBytes(8).toString("hex");

        const newDomain = await prisma.customDomain.create({
            data: {
                domain: rootDomain,
                subDomain: subDomain,
                txtValue: verificationToken,
                txtVerified: false,
                cnameTarget: "fasturl.in",
                cnameVerfied: false,
                isActive: false,
                userId: decoded.userId,
            }
        })

        return NextResponse.json({
            success: true,
            verificationToken: newDomain.txtValue,
            cnameTarget: newDomain.cnameTarget,
            domain: newDomain.domain,
            subDomain: newDomain.subDomain
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Errow while adding domain"},
            {status: 500}
        );
    }
}