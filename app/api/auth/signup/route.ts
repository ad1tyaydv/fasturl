import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {

    try {

        const data = await req.json();

        if (!data.email) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 });
        }

        const findUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (findUser) {
            return NextResponse.json(
                { message: "User already exists!" },
                { status: 400 }
            )
        }


        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.oTP.create({
            data: {
                email: data.email,
                otp: otp,
                reason: "signup",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });

        await resend.emails.send({
            from: "FastURL <no-reply@fasturl.in>",
            to: [data.email],
            subject: "Signup otp for fasturl",
            html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 40px 20px; color: #000;">
      <p style="font-size: 18px; margin-bottom: 24px;">Enter this code to complete verification:</p>
      
      <div style="display: inline-block; background-color: #e5e5e5; padding: 15px 40px; border-radius: 8px; margin-bottom: 30px;">
        <h1 style="margin: 0; color: #83c5be; font-size: 36px; letter-spacing: 4px; font-weight: bold;">${otp}</h1>
      </div>

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
            { message: "Otp is sent to your email" },
            { status: 200 }
        )


    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error while signing up!", error },
            { status: 500 }
        )
    }
}