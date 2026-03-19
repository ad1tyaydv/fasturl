import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(req: NextRequest) {

    try {
        const data = await req.json();

        if (!data.shortUrlId) {
            return NextResponse.json(
                { message: "Invalid URL ID" },
                { status: 400 }
            );
        }

        let hashedPassword = null;

        if(data.password) {
            hashedPassword = await bcrypt.hash(data.password, 10);
        }

        const expiresAt = new Date(data.expiryDate);

        await prisma.link.update({
            where: {
                id: data.shortUrlId
            },
            data: {
                password: hashedPassword,
                expiresAt: expiresAt
            }
        })

        return NextResponse.json(
            {message: "Password Protection added"},
            {status: 200}
        )
        
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Error while adding password protection"},
            {status: 500}
        )
    }
}