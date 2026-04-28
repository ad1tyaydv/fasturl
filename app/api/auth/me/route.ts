import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";


const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

function add30Days(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 30);
  return d;
}

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

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        if (user.plan !== "FREE" && user.planExpiresAt && new Date() > new Date(user.planExpiresAt)) {
            const now = new Date();
            const cycleEnd = add30Days(now);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    plan: "FREE",
                    totalLinks: 100,
                    totalQr: 30,
                    billingStatus: null,
                    linksUsed: 0,
                    qrUsed: 0,
                    cycleStart: now,
                    cycleEnd: cycleEnd,
                }
            });

            await prisma.api_key.updateMany({
                where: {
                    userId: decoded.userId
                },
                data: {
                    isActive: false
                }
            })

            await prisma.notification.create({
                data: {
                    userId: user.id,
                    title: "Plan Expired",
                    message: "Your plan has expired, upgrade to unlock all the features again.",
                    actionUrl: "/premium"
                }
            });

            await redis.del(`links-left:${decoded.userId}`)
            await redis.del(`qrs-left:${decoded.userId}`)

            return NextResponse.json({
                userName: user.userName,
                email: user.email,
                authenticated: true,
                plan: "FREE",
                planStartedAt: null,
                planExpiresAt: null,
                twofactorEnabled: user.twofactorEnabled,
                totalLinks: 0,
                linksUsed: 0,
                image: user.image,
                bulkLinks: 0,
                totalQrCodes: 0,
                qrUsed: 0,
                unreadNotifications: 1,
                isActive: false,
                daysLeft: 0
            });
        }
        

        const checkPlan = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                userName: true,
                image: true,
                email: true,
                plan: true,
                planType: true,
                linksUsed: true,
                qrUsed: true,
                planExpiresAt: true,
                planStartedAt: true,
                twofactorEnabled: true,
                _count: {
                    select: {
                        links: true,
                        bulkLinks: true,
                        qr: true,
                        notification: {
                            where: {
                                isRead: false
                            }
                        }
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

        let currentPlan = "FREE";
        let isActive = false;
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
            planType: checkPlan.planType,
            planStartedAt: planStartedAt,
            planExpiresAt: planExpiresAt,
            twofactorEnabled: checkPlan.twofactorEnabled,
            totalLinks: checkPlan._count.links,
            linksUsed: checkPlan.linksUsed,
            image: checkPlan.image,
            bulkLinks: checkPlan._count.bulkLinks,
            totalQrCodes: checkPlan._count.qr,
            qrUsed: checkPlan.qrUsed,
            unreadNotifications: checkPlan._count.notification,
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