import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.AUTH_SECRET!;

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if(!token) {
            return NextResponse.json(
                { authenticated: false }
            );
        }

        jwt.verify(token, JWT_SECRET);

        return NextResponse.json(
            { authenticated: true }
        );

    } catch (error) {
        return NextResponse.json(
            { authenticated: false }
        );
    }
}