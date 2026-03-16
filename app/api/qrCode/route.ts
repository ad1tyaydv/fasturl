import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;
const ANON_USER_ID = process.env.ANONYMOUS_USER_ID!;

export async function POST(req: NextRequest) {

    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ||
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
    
        const today = new Date()
        today.setHours(0,0,0,0);

        const token = req.cookies.get("token")?.value;

        const data = await req.json();
        console.log(data);

        if(!data.shortUrl || !data.longUrl) {
            return NextResponse.json(
                {message: "Something went wrong!"},
                {status: 500}
            )
        }


        let userId: string;
        let count = 0;

        if(!token) {
            return NextResponse.json(
                {message: "Login to generate QR code"},
                {status: 429}
            )

        } else {
            const decoded = jwt.verify(token, JWT_SECRET) as {
                userId: string;
                emailId: string;
            }

            userId = decoded.userId;

            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    email: true,
                }
            });


            if (!user) {
                return NextResponse.json(
                    { message: "User not found" },
                    { status: 404 }
                );
            }

        }

        count = await prisma.qr.count({
            where: {
                userId: userId,
                createdAt: {
                    gte: today
                }
            }
        })

        if(count >= 1) {
            return NextResponse.json(
                {message: "Upgrade to generate utpo 500 QR Codes per month"},
                {status: 429}
            )
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

        return NextResponse.json({
            message: "Short URL created!",
            shortUrl: saveQR.shortUrl,
            original: saveQR.longUrl,
            qrImage: saveQR.qrImage,
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Something went wrong!"},
            {status: 500}
        )
    }
}