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
            subject: "Password Reset OTP",
            html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Welcome to fasturl</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:6px;">${otp}</h1>
          <p>This OTP expires in 10 minutes.</p>
        </div>
      `,
        });

        return NextResponse.json(
            {message: "Otp is sent to your email"},
            {status: 200}
        )


    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error while signing up!", error },
            { status: 500 }
        )
    }
}