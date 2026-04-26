import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import csv from "csv-parser";
import shortUrlGenerator from "@/app/helpers/shortUrlGenerator";
import { prisma } from "@/lib/dbConfig";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { redis } from "@/lib/redis";


const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_DOMAIN!
const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

const chunkArray = (array: any[], size: number) => {
    const chunked = [];

    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }

    return chunked;
};

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
        if (!file) {
            return NextResponse.json(
                {error: "No file uploaded"},
                {status: 400}
            );
        }

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
        

        const text = await file.text();
        const rawLines = text.split("\n").filter(line => line.trim() !== "");

        const validLinks = rawLines.map(line => {
            const [url, customUrl] = line.split(",");
            return {
                url: url?.trim(),
                customUrl: customUrl?.trim() || null,
            }
        }).filter(link => link.url && link.url.startsWith("http"))

        const totalRequestedLinks = validLinks.length;

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                totalLinks: true,
                plan: true
            }
        });

        if(!user) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            )
        }

        if((user.plan === "ESSENTIAL" || user.plan === "PRO") && totalRequestedLinks > 5000) {
            return NextResponse.json(
                {message: "You can generate only 5000 links at once"},
                {status: 400}
            )
        }

        const result = await prisma.$transaction(async (tx) => {

            if(user.totalLinks < totalRequestedLinks) {
                throw new Error("Limit Exceeded");
            }

            await tx.user.update({
                where: {
                    id: decoded.userId
                },
                data: {
                    linksUsed: {
                        increment: totalRequestedLinks
                    },
                    totalLinksCreated: {
                        increment: totalRequestedLinks
                    }
                }
            })

            const bulkHeader = await tx.bulkLinks.create({
                data: {
                    userId: decoded.userId,
                    name: "United bulk links",
                    password: hashedPassword,
                    expiresAt: expiresAt
                }
            })

            const LinksToInsert = validLinks.map(link => ({
                userId: decoded.userId,
                original: link.url,
                shorturl: link.customUrl || shortUrlGenerator(),
                password: hashedPassword,
                expiresAt: expiresAt,
                bulkLinksId: bulkHeader.id,
                checkBulk: true
            }))

            await redis.del(`fetchBulkLinks:${decoded.userId}`)

            const chunks = chunkArray(LinksToInsert, 2000);
            let createdCount = 0;

            for(const chunk of chunks) {
                const batch = await tx.link.createMany({
                    data: chunk,
                    skipDuplicates: true
                })
                
                createdCount += batch.count;
            }

            if(createdCount < totalRequestedLinks) {
                const refund = totalRequestedLinks - createdCount;

                await tx.user.update({
                    where: {
                        id: decoded.userId
                    },
                    data: {
                        linksUsed: {
                            increment: refund
                        }
                    }
                })
            }

            return {
                count: createdCount
            }
        }, {
            timeout: 90000,
            isolationLevel: "Serializable"
        })

        return NextResponse.json({
            success: true,
            count: result.count,
            message: `Successfully processed ${result.count} links.`
        });

    } catch (error: any) {
        console.error("BULK_UPLOAD_ERROR:", error);
        
        if (error.message === "LIMIT_EXCEEDED") {
            return NextResponse.json(
                {message: "Insufficient link quota"},
                {status: 403}
            );
        }
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )   
    }
}