import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import shortUrlGenerator from "@/app/helpers/shortUrlGenerator";
import bcrypt from "bcryptjs";
import { redis } from "@/lib/redis";


const NEXT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;

async function logApiRequest(data: any) {
    try {
        await prisma.apiLog.create({
            data: {
                apiKeyId: data.apiKeyId ?? undefined,
                endpoint: data.endpoint,
                method: data.method,
                status: data.status,
                success: data.success,
                error: data.error,
                device: data.userAgent ?? null,
            },
        });

    } catch (err) {
        console.log("Logging failed:", err);
    }
}


async function incrementFailed(keyId: string) {

    try {
        await prisma.api_key.update({
            where: { id: keyId },
            data: {
                usageCount: { increment: 1 },
                failed: { increment: 1 },
            },
        });

    } catch (err) {
        console.log("Failed to increment failed count:", err);
    }
}


export async function POST(req: NextRequest) {
    const endpoint = "/v1/shortLink";
    const method = "POST";
    const userAgent = req.headers.get("user-agent") || null;

    try {
        const auth = req.headers.get("authorization");
        const apikey = auth?.split(" ")[1];

        if (!apikey) {
            await logApiRequest({
                apiKeyId: null,
                endpoint,
                method,
                status: 401,
                success: false,
                error: "API key required",
                userAgent,
            });

            return NextResponse.json(
                { success: false, message: "API key required" },
                { status: 401 }
            );
        }

        const key = await prisma.api_key.findUnique({
            where: { key: apikey },
        });

        if (!key || !key.isActive) {
            await logApiRequest({
                apiKeyId: key?.id ?? null,
                endpoint,
                method,
                status: 401,
                success: false,
                error: "Invalid API key",
                userAgent,
            });

            if (key?.id) await incrementFailed(key.id);

            return NextResponse.json(
                { message: "Invalid api key" },
                { status: 401 }
            );
        }

        if (key.usageCount >= key.usageLimit) {
            await logApiRequest({
                apiKeyId: key.id,
                endpoint,
                method,
                status: 429,
                success: false,
                error: "Usage limit exceeded",
                userAgent,
            });

            await incrementFailed(key.id);

            return NextResponse.json(
                { success: false, message: "Usage limit exceeded" },
                { status: 429 }
            );
        }

        const { url, linkName, password, expiry } = await req.json();

        if (!url) {
            await logApiRequest({
                apiKeyId: key.id,
                endpoint,
                method,
                status: 400,
                success: false,
                error: "URL is required",
                userAgent,
            });

            await incrementFailed(key.id);

            return NextResponse.json(
                { success: false, message: "URL is required" },
                { status: 400 }
            );
        }

        try {
            new URL(url);
        } catch {
            await logApiRequest({
                apiKeyId: key.id,
                endpoint,
                method,
                status: 400,
                success: false,
                error: "Invalid URL",
                userAgent,
            });

            await incrementFailed(key.id);

            return NextResponse.json(
                { success: false, message: "Invalid URL" },
                { status: 400 }
            );
        }

        const shortCode = shortUrlGenerator();

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        let expiryDate = null;
        if (expiry) {
            expiryDate = new Date(expiry);

            if (expiryDate < new Date()) {
                await logApiRequest({
                    apiKeyId: key.id,
                    endpoint,
                    method,
                    status: 400,
                    success: false,
                    error: "Expiry must be future date",
                    userAgent,
                });

                await incrementFailed(key.id);

                return NextResponse.json(
                    { success: false, message: "Expiry must be future date" },
                    { status: 400 }
                );
            }
        }

        await prisma.link.create({
            data: {
                apiLinkId: key.id,
                original: url,
                shorturl: shortCode,
                linkName: linkName || null,
                password: hashedPassword,
                isProtected: !!password,
                expiresAt: expiryDate,
                userId: key.userId,
                api_link: true,
            },
        });

        await redis.del(`apiKeyRequest:${key.userId}`);
        await redis.del(`apiKeyLogs:${key.userId}`);


        await prisma.api_key.update({
            where: {
                id: key.id
            },
            data: {
                usageCount: {
                    increment: 1
                },
                success: {
                    increment: 1
                },
            },
        });


        await logApiRequest({
            apiKeyId: key.id,
            endpoint,
            method,
            status: 200,
            success: true,
            error: null,
            userAgent,
        });

        return NextResponse.json({
            success: true,
            shortUrl: `${NEXT_DOMAIN}/${shortCode}`,
        });

    } catch (error) {
        await logApiRequest({
            apiKeyId: null,
            endpoint,
            method,
            status: 500,
            success: false,
            error: error instanceof Error ? error.message : "Server error",
            userAgent,
        });

        return NextResponse.json(
            { success: false, message: "Server error, try again later" },
            { status: 500 }
        );
    }
}