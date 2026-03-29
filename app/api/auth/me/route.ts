import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if(!token) {
            return NextResponse.json(
                { authenticated: false }
            );
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);

        let currentPlan = "FREE";
        let isActive = false;

        const checkPlan = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                userName: true,
                email: true,
                plan: true,
                planExpiresAt: true,
                planStartedAt: true
            }
        })

        if(!checkPlan) {
            return NextResponse.json({
                authenticated: false
            })
        }

        const expiresAt = checkPlan.planExpiresAt;

        if(checkPlan.plan !== "FREE" && expiresAt && new Date(expiresAt) > new Date() ) {
            currentPlan = checkPlan.plan;
            isActive = true;
        }

        let daysLeft = 0;
        if(expiresAt) {
            const diff = new Date(expiresAt).getTime() - new Date().getTime();
            daysLeft = Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
        }


        return NextResponse.json({
            userName: checkPlan.userName,
            email: checkPlan.email,
            authenticated: true,
            plan: currentPlan,
            isActive: isActive,
            daysLeft: daysLeft
        });

    } catch (error) {
        return NextResponse.json({
            authenticated: false
        });
    }
}