import { prisma } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest, { params }: { params: Promise<{id: string}> }) {

    const { id } = await params;

    console.log(id)

    try {
        const token = req.cookies.get("token")?.value;

        if(!token) {
            return NextResponse.json(
            {messgae: "User is not authenticated"},
            {status: 400}
        )}

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
        }
        const userId = decoded.userId;
        
        await prisma.customDomain.deleteMany({
            where: {
                id: id
            }
        })

        return NextResponse.json(
            {message: "Domain deleted successfully"},
            {status: 200}
        )

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Error while deleting domain"},
            {status: 500}
        )
    }
}