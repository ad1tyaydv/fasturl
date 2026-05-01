import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;
    
        if(!token) {
            return NextResponse.json(
                {message: "Please login first"},
                {status: 404}
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string
        }
        const userId = decoded.userId;

        const secret = speakeasy.generateSecret({
            length: 20,
            name: "fasturl"
        })

        const qrCode = await QRCode.toDataURL(secret.otpauth_url!)

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                twofactorSecret: secret.base32,
                twofactorEnabled: false
            }
        })

        return NextResponse.json({
            secret: secret.base32,
            qrCode: qrCode
        })
        
    } catch (error) {
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
}