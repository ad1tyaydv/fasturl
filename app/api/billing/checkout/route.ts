import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDodoClient, getProductIdForPlan } from "@/lib/dodo";

type Plan = "ESSENTIAL" | "PRO";

function getOrigin(req: NextRequest) {
    const proto = req.headers.get("x-forwarded-proto") ?? "http";
    const host = req.headers.get("host") ?? "localhost:3000";
    return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const JWT_SECRET = process.env.NEXTAUTH_SECRET;

        if (!token || !JWT_SECRET) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            email: string;
            userName: string;
        };

        const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
        const plan = body?.plan as Plan | undefined;

        if (plan !== "ESSENTIAL" && plan !== "PRO") {
            return NextResponse.json(
                { error: "Invalid plan" },
                { status: 400 }
            );
        }

        const productId = getProductIdForPlan(plan);
        const client = getDodoClient();

        const origin = getOrigin(req);
        const returnUrl = process.env.DODO_PAYMENTS_RETURN_URL;

        const session = await client.checkoutSessions.create({
            product_cart: [{ product_id: productId, quantity: 1 }],
            customer: {
                email: decoded.email,
                name: decoded.userName,
            },
            billing_currency: "INR",
            return_url: returnUrl,
            metadata: {
                user_id: decoded.userId,
                plan,
                source: "nextjs_premium_page",
            },
        });

        return NextResponse.json({
            checkout_url: session?.checkout_url,
            session_id: session?.session_id,
        });

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    } 
}