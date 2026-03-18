import { prisma } from "@/lib/dbConfig";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    
    try {
        const data = await req.json();

        await prisma.user.update({
            where: {
                email: data.email,
            },
            data: {
                userName: data.userName
            }
        })

        return NextResponse.json(
            {message: "UserName updated successfully"},
            {status: 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
}