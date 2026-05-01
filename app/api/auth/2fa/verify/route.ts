import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import { Resend } from "resend";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Please login first" },
                { status: 404 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string
        }
        const userId = decoded.userId;


        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                email: true,
                twofactorSecret: true,
                twofactorEnabled: true
            }
        })

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        const data = await req.json();

        if (user.twofactorSecret) {
            const verified = speakeasy.totp.verify({
                secret: user.twofactorSecret,
                encoding: "base32",
                token: data.otp,
                window: 1,
            })

            if (!verified) {
                return NextResponse.json(
                    { message: "Invalid OTP" },
                    { status: 400 }
                )
            }

        } else {
            return NextResponse.json(
                { message: "Enable 2fa first" },
                { status: 400 }
            )
        }

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                twofactorEnabled: true
            }
        })

        await prisma.notification.create({
            data: {
                userId: userId,
                title: "two factor authentication",
                message: "Your account is now more secure with two factor authentication.",
                actionUrl: "/"
            }
        })

        await resend.emails.send({
            from: "FastURL <no-reply@fasturl.in>",
            to: [user.email],
            subject: "2FA Enabled",
            html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 40px 20px; color: #000;">
            <p style="font-size: 18px; margin-bottom: 24px;">Two-factor authentication (2FA) is now enabled in your account.</p>
            
            <div style="display: inline-block; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px 40px; border-radius: 8px; margin-bottom: 30px;">
              <h1 style="margin: 0; color: #22c55e; font-size: 24px; font-weight: bold;">2FA SECURED</h1>
            </div>
      
            <p style="font-size: 14px; color: #666; margin-top: -10px; margin-bottom: 30px;">Your account is now protected with an additional layer of security.</p>
      
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px auto; width: 80%;" />
      
            <p style="font-size: 16px; color: #000;">
              Need help? Contact us at <a href="mailto:fasturl@tutamail.com" style="color: #22c55e; text-decoration: underline;">fasturl@tutamail.com</a>.
            </p>
      
            <div style="margin-top: 40px;">
              <h2 style="font-size: 32px; font-weight: bold; color: #83c5be; margin: 0;">fasturl</h2>
            </div>
          </div>
          `,
        });

        return NextResponse.json(
            { message: "Two factor authentication enabled" },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}