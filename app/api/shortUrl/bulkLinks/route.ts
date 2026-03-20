import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import csv from "csv-parser";
import shortUrlGenerator from "@/app/helpers/shortUrlGenerator";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_DOMAIN!
const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

    const today = new Date();
    const token = req.cookies.get("token")?.value;

    if(!token) {
        return NextResponse.json(
            {message: "Token not found"},
            {status: 404}
        )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
        userId: string;
        email: string;
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        const pass = formData.get("password") as string | null;
        const password = pass?.trim() || null;
        let hashedPassword = "";
        if(password) {
            hashedPassword = await bcrypt.hash(password!, 10);
        }

        const expiryDate = formData.get("expiryDate") as string | null;
        const expiresAt = expiryDate ? new Date(expiryDate) : null

        if (expiresAt && isNaN(expiresAt.getTime())) {
            return NextResponse.json(
                {message: "Invalid expiry date"}, 
                {status: 400});
        }

        if(!file) {
            return NextResponse.json(
                {error: "No file uploaded"}
            );
        }

        
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);

        const text = await file.text();
        let results: any[] = [];

        if(text.startsWith("url")) {
            await new Promise((resolve, reject) => {
                stream
                    .pipe(csv())
                    .on("data", (data) => {
                        results.push(data);
                    })
                    .on("end", resolve)
                    .on("error", reject);
            })

        } else {
            results = text.split("\n").map(line => ({
                url: line.trim()
            }));
        }

        const checkLimit = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
            select: {
                plan: true,
                planExpiresAt: true,
                links: true
            }
        })

        const validLinks = results.filter(row => {
            const url = row.url?.trim();
            return url && url.startsWith("http");
        })

        const totalLinks = validLinks.length;

        if(!checkLimit) {
            return NextResponse.json(
                {message: "User not found"}
            )
        }

        if(checkLimit.plan === "FREE") {
            return NextResponse.json(
                {message: "Upgrade to generate upto 40,000 links per month"},
                {status: 403}
            )
        }

        if(checkLimit?.plan === "ESSENTIAL") {
            if(checkLimit?.planExpiresAt! > today && checkLimit.links.length + totalLinks > 20000) {
                return NextResponse.json(
                    {message: "You have reached you links generation limit, Upgrade to generate more links"},
                    {status: 403}
                )
            }
        }

        if(checkLimit?.plan === "PRO") {
            if(checkLimit?.planExpiresAt! > today && checkLimit.links.length + totalLinks > 40000) {
                return NextResponse.json(
                    {messgae: "You have reached you links generation limit, Upgrade to generate more links"},
                    {status: 403}
                )
            }
        }

        const success: any[] = [];
        const failed: any[] = [];

        for (let row of validLinks) {
            const url = row.url?.trim();

            try {
                const shortUrl = shortUrlGenerator();

                await prisma.link.create({
                    data: {
                        userId: decoded.userId,
                        original: url,
                        shorturl: shortUrl,
                        password: hashedPassword,
                        expiresAt: expiresAt
                    }
                })

                success.push({
                    original: url,
                    short: `${NEXT_PUBLIC_BASE_URL}/${shortUrl}`,
                })

            } catch (error) {
                failed.push({
                    url,
                    error: "DB error"
                });
            }
        }

        return NextResponse.json({
            success: success,
            failed: failed,
        })

    } catch (error) {
     return NextResponse.json(
        {message: "Something went wrong"},
        {status: 500}
     )   
    }
}