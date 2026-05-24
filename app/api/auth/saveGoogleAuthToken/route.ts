import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const token = body.token;

        if (!token) {
            return NextResponse.json(
                { message: "Token missing" },
                { status: 400 }
            );
        }

        const response = NextResponse.json({
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { message: "Error saving token" },
            { status: 500 }
        );
    }
}