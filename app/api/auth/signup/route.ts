import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {

    const data = await req.json();

    try {

        const findUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if(findUser) {
            return NextResponse.json(
                {message: "user already exists!"},
                {status: 400}
            )
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userSignup = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            }
        })

        const token = jwt.sign(
            {
                userId: userSignup.id,
                email: data.email
            },
            NEXTAUTH_SECRET!,
            {
                expiresIn: "365d"
            }
        );

        const response = NextResponse.json(
            {message: "User signed up successfully"},
            {status: 200}
        )

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        });

        return response;
        
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Error while signing up!", error},
            {status: 500}
        )
    }
}