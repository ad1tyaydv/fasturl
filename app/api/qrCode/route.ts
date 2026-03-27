import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ||
                   req.headers.get("x-real-ip") ||
                   "127.0.0.1";

        const today = new Date()
        today.setHours(0, 0, 0, 0);

        const token = req.cookies.get("token")?.value;

        const data = await req.json();

        if (!data.shortUrl || !data.longUrl) {
            return NextResponse.json(
                { message: "Something went wrong!" },
                { status: 500 }
            )
        }

        let userId: string;
        let count = 0;

        if (!token) {
            return NextResponse.json(
                { message: "Login to generate QR code" },
                { status: 429 }
            )

        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            emailId: string;
        }

        userId = decoded.userId;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });


        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (token && user) {
            if (user.plan === "FREE") {
                count = await prisma.qr.count({
                    where: {
                        userId: userId,
                        createdAt: {
                            gte: today
                        }
                    }
                });

                if (count >= 2) {
                    return NextResponse.json(
                        { message: "Upgrade to generate up to 2,000 QR Codes every month" },
                        { status: 429 }
                    );
                }
            }

            else if (user.plan === "ESSENTIAL") {
                if (user.planExpiresAt && user.planExpiresAt < today) {
                    return NextResponse.json(
                        { message: "Your ESSENTIAL plan has expired. Upgrade to continue" },
                        { status: 403 }
                    );
                }

                count = await prisma.qr.count({
                    where: {
                        userId: userId,
                        createdAt: {
                            gte: today
                        }
                    }
                });

                if (count >= 200) {
                    return NextResponse.json(
                        { message: "Upgrade to generate up to 2,000 QR Codes every month" },
                        { status: 429 }
                    );
                }
            }

            else {
                count = await prisma.qr.count({
                    where: {
                        userId: userId,
                        createdAt: {
                            gte: today
                        }
                    }
                });

                if (count >= 2000) {
                    return NextResponse.json(
                        { message: "Upgrade again to generate up to 2,000 QR Codes every month" },
                        { status: 429 }
                    );
                }
            }
        }

        const fullShortUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/${data.shortUrl}`;

        const qr = await QRCode.toDataURL(fullShortUrl, {
            width: 300,
            errorCorrectionLevel: "H",
            margin: 2,
            color: {
                dark: "#000000",
                light: "#ffffff"
            }
        });

        const saveQR = await prisma.qr.create({
            data: {
                userId: userId,
                longUrl: data.longUrl,
                shortUrl: data.shortUrl,
                qrImage: qr,
                ipAddress: ip,
            }
        })

        console.log(saveQR.qrImage);

        return NextResponse.json({
            message: "Short URL created!",
            shortUrl: saveQR.shortUrl,
            original: saveQR.longUrl,
            qrImage: saveQR.qrImage,
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Something went wrong!" },
            { status: 500 }
        )
    }
}