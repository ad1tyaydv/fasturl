import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("🔥 WEBHOOK RECEIVED:", JSON.stringify(body, null, 2));

    const event = body.type;
    const metadata = body.data?.metadata;

    if (!metadata) {
      console.log("❌ No metadata found");
      return NextResponse.json({ received: true });
    }

    const userId = metadata.user_id; // ✅ FIXED (IMPORTANT)
    const plan = metadata.plan;

    if (!userId || !plan) {
      console.log("❌ Missing userId or plan", { userId, plan });
      return NextResponse.json({ received: true });
    }

    // Accept all relevant Dodo events
    const shouldUpdate =
      event === "payment.succeeded" ||
      event === "subscription.created" ||
      event === "subscription.active" ||
      event === "subscription.updated";

    if (!shouldUpdate) {
      console.log("ℹ️ Ignored event:", event);
      return NextResponse.json({ received: true });
    }

    // Plan duration logic (1 month)
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        plan,
        planStartedAt: startDate,
        planExpiresAt: expiryDate,
      },
    });

    console.log("✅ USER UPDATED SUCCESSFULLY:", updatedUser);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.log("❌ WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}