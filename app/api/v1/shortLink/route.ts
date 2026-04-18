import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import shortUrlGenerator from "@/app/helpers/shortUrlGenerator";
import bcrypt from "bcryptjs";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

function add30Days(date: Date) {
    const d = new Date(date);
    d.setDate(d.getDate() + 30);
    return d;
}

export async function POST(req: NextRequest) {

    try {

        const auth = req.headers.get("authorization");
        const apikey = auth?.split(" ")[1];

        if (!apikey) {
            return NextResponse.json(
                { error: "API key required" },
                { status: 401 }
            );
        }

        const key = await prisma.api_key.findUnique({
            where: {
                key: apikey,
            }
        })

        if (!key || !key.isActive) {
            return NextResponse.json(
                { message: "Invalid api key" },
                { status: 404 }
            )
        }

        const { url, linkName, password, expiry } = await req.json();

        const shortCode = shortUrlGenerator();

        let hashedPassword = null;
        if(password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        let expiryDate = null;
        if (expiry) {
            expiryDate = new Date(expiry);
        }

        await prisma.link.create({
            data: {
                apiLinkId: key.id,
                original: url,
                shorturl: shortCode,
                password: hashedPassword,
                isProtected: password ? true : false,
                expiresAt: expiryDate,
                userId: key.userId,
                api_link: true
            }
        });

        await prisma.api_key.update({
            where: {
                id: key.id
            },
            data: {
                usageCount: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({
            shortUrl: `https://fasturl.in/${shortCode}`
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Server error, try again later" },
            { status: 500 }
        );
    }
}