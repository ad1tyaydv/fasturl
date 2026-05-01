import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if(!token) {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
            )
        }
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
        };
        const userId = decoded.userId;

        const userTier = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                plan: true
            }
        })

        if(userTier?.plan === 'FREE') {
            return NextResponse.json(
                {message: "Please upgrade to add domains!"},
                {status: 404}
            )
        }
        

        const userDomains = await prisma.customDomain.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                domain: true,
                subDomain: true,
                isActive: true,
                txtName: true,
                txtValue: true,
                cnameTarget: true,
                createdAt: true
            }
        })

        return NextResponse.json(
            {message: "User domains fetched", userDomains},
            {status: 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message: "Error while fetching domain"},
            {status: 500}
        )
    }
}