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

        const { domain } = await req.json();

        const existing = await prisma.customDomain.findUnique({
            where: { domain }
        });

        if (existing) {
            return NextResponse.json({
                verificationToken: existing.token
            });
        }

        const verificationToken = crypto.randomBytes(8).toString("hex");

        const newDomain = await prisma.customDomain.create({
            data: {
                domain: domain,
                token: verificationToken,
                userId: decoded.userId,
                verified: false,
            }
        })

        return NextResponse.json({
            success: true,
            verificationToken,
            domain: domain
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Errow while adding domain"},
            {status: 500}
        );
    }
}