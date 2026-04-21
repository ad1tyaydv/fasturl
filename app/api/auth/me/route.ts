import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: NextRequest) {

    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        let decoded: any;

        try {
            decoded = jwt.verify(token, JWT_SECRET);

        } catch {
            return NextResponse.json({ authenticated: false });
        }

        let currentPlan = "FREE";
        let isActive = false;

        const checkPlan = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                userName: true,
                image: true,
                email: true,
                plan: true,
                planExpiresAt: true,
                planStartedAt: true,
                twofactorEnabled: true,
                _count: {
                    select: {
                        links: true,
                        bulkLinks: true,
                        qr: true
                    }
                }
            }
        })

        if (!checkPlan) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        const expiresAt = checkPlan.planExpiresAt;

        if (checkPlan.plan !== "FREE" && expiresAt && new Date(expiresAt) > new Date()) {
            currentPlan = checkPlan.plan;
            isActive = true;
        }

        let daysLeft = 0;
        if (expiresAt) {
            const diff = new Date(expiresAt).getTime() - new Date().getTime();
            daysLeft = Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
        }

        const planStartedAt = checkPlan.planStartedAt
            ? new Date(checkPlan.planStartedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
            })
            : null;

        const planExpiresAt = checkPlan.planExpiresAt
            ? new Date(checkPlan.planExpiresAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
            })
            : null;


        return NextResponse.json({
            userName: checkPlan.userName,
            email: checkPlan.email,
            authenticated: true,
            plan: currentPlan,
            planStartedAt: planStartedAt,
            planExpiresAt: planExpiresAt,
            twofactorEnabled: checkPlan.twofactorEnabled,
            totalLinks: checkPlan._count.links,
            image: checkPlan.image,
            bulkLinks: checkPlan._count.bulkLinks,
            totalQrCodes: checkPlan._count.qr,
            isActive: isActive,
            daysLeft: daysLeft
        });

    } catch (error) {
        return NextResponse.json(
            { authenticated: false },
            { status: 401 }
        );
    }
}