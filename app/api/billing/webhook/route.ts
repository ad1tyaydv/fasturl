import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/dbConfig";
import { redis } from "@/lib/redis";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

type Plan = "FREE" | "ESSENTIAL" | "PRO";

const PLAN_LIMITS = {
  FREE: { links: 100, qr: 30 },
  ESSENTIAL: { links: 10000, qr: 300 },
  PRO: { links: 40000, qr: 2000 },
};

const PLAN_PRIORITY: Record<Plan, number> = {
  FREE: 0,
  ESSENTIAL: 1,
  PRO: 2,
};

async function sendEmail(to: string, subject: string, userName: string, title: string, message: string) {
  try {
    await resend.emails.send({
      from: "FastURL <no-reply@fasturl.in>",
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 50px 20px; color: #000; line-height: 1.6;">
          
          <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">${title}</h2>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 24px;">
            Hello <strong>${userName || "there"}</strong>,
          </p>

          <div style="max-width: 500px; margin: 0 auto; font-size: 16px; color: #444; text-align: center;">
            ${message}
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 40px auto; width: 80%;" />

          <p style="font-size: 15px; color: #000;">
            Need help? Contact us at <a href="mailto:fasturl@tutamail.com" style="color: #83c5be; text-decoration: underline;">fasturl@tutamail.com</a>.
          </p>

          <div style="margin-top: 50px;">
            <h2 style="font-size: 32px; font-weight: bold; color: #83c5be; margin: 0; letter-spacing: -1px;">fasturl</h2>
          </div>
          
        </div>
      `,
    });

  } catch (error) {
    console.error("Error while sending email");
  }
}


export async function POST(req: NextRequest) {

  try {
    const body = await req.json();

    const event = body?.type;
    const data = body?.data;
    const eventId = body?.id || data?.payment_id || data?.subscription_id;
    const metadata = data?.metadata;

    const alreadyProcessed = await redis.get(`event:${eventId}`);
    if (alreadyProcessed) {
      return NextResponse.json({ received: true });
    }

    await redis.set(`event:${eventId}`, "1", { ex: 60 * 60 });

    if (!metadata) {
      return NextResponse.json({ received: true });
    }

    const userId = metadata.user_id;
    const plan = metadata.plan as Plan;
    if (!["FREE", "ESSENTIAL", "PRO"].includes(plan)) {
      return NextResponse.json({ received: true });
    }
    const planType = (metadata.planType as "MONTHLY" | "ANNUALLY") || "MONTHLY";

    if (!userId) {
      return NextResponse.json({ received: true });
    }

    const subscriptionId = data?.subscription_id || null;
    const customerId = data?.customer?.customer_id || null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ received: true });
    }

    if (event === "payment.succeeded") {
      if (PLAN_PRIORITY[plan] < PLAN_PRIORITY[user.plan as Plan]) {
        return NextResponse.json({ received: true });
      }

      const limits = PLAN_LIMITS[plan];

      const startDate = new Date();
      const expiryDate = new Date();
      if (planType === "ANNUALLY") {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      }

      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          plan: plan,
          planType: planType,
          totalLinks: limits.links,
          linksUsed: 0,
          totalQr: limits.qr,
          qrUsed: 0,
          planStartedAt: startDate,
          planExpiresAt: expiryDate,
          subscriptionId,
          customerId,
          billingStatus: "active",
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          title: "Plan Upgraded!",
          message: `Your plan has been successfully upgraded to ${plan} (${planType}). Enjoy your new limits!`,
          metadata: { plan, planType, event: "upgrade" },
          actionUrl: "/premium"
        }
      });

      await sendEmail(
        user.email,
        "Your payment was successful - FastURL",
        user.userName || "",
        "Payment Successful",
        `Your payment of ${data.total_amount / 100} ${data.currency} was successful. Your account has been upgraded to the ${plan} plan (${planType}). Enjoy your new limits!`
      );

      await prisma.payment.upsert({
        where: {
          paymentId: data.payment_id
        },
        update: {
          status: "succeeded"
        },
        create: {
          userId,
          paymentId: data.payment_id,
          subscriptionId,
          amount: data.total_amount / 100,
          currency: data.currency,
          status: "succeeded",
          method: data.payment_method,
        },
      });

      if (subscriptionId) {
        await prisma.subscription.upsert({
          where: {
            subscriptionId: subscriptionId
          },
          update: {
            plan,
            planType: planType,
            status: "active",
            planStartedAt: startDate,
            planEndedAt: expiryDate,
          },
          create: {
            user: {
              connect: {
                id: userId
              }
            },
            plan,
            planType,
            status: "active",
            subscriptionId,
            customerId,
            planStartedAt: startDate,
            planEndedAt: expiryDate,
          },
        });
      }

      await redis.del(`links-left:${userId}`);
      await redis.del(`qrs-left:${userId}`);
    }


    if (event === "payment.failed") {
      if (user.billingStatus === "active") {
        return NextResponse.json({ received: true });
      }
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          billingStatus: "failed"
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          title: "Payment Failed",
          message: `Your payment for the ${plan} plan failed. Please check your payment method and try again.`,
          metadata: { plan, event: "payment_failed" },
          actionUrl: "/premium"
        }
      });

      await sendEmail(
        user.email,
        "Payment failed - FastURL",
        user.userName || "",
        "Payment Failed",
        `Your payment for the ${plan} plan failed. Please check your payment method and try again. If you have any questions, feel free to reach out to our support team.`
      );

      await prisma.payment.upsert({
        where: {
          paymentId: data.payment_id
        },
        update: {
          status: "failed"
        },
        create: {
          userId,
          paymentId: data.payment_id,
          subscriptionId,
          amount: data.total_amount / 100,
          currency: data.currency,
          status: "failed",
          method: data.payment_method,
        },
      });

      if (subscriptionId) {
        await prisma.subscription.upsert({
          where: { subscriptionId },
          update: {
            plan,
            status: "failed",
          },
          create: {
            user: { connect: { id: userId } },
            plan,
            status: "failed",
            subscriptionId,
            customerId,
          },
        });
      }
    }


    if (event === "payment.processing") {
      if (user.billingStatus === "active") {
        return NextResponse.json({ received: true });
      }
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          billingStatus: "pending"
        },
      });

      await sendEmail(
        user.email,
        "Payment is processing - FastURL",
        user.userName || "",
        "Payment Processing",
        `Your payment for the ${plan} plan is currently being processed. We will notify you once the payment is completed and your account is upgraded.`
      );

      await prisma.payment.upsert({
        where: {
          paymentId: data.payment_id
        },
        update: {

        },
        create: {
          userId,
          paymentId: data.payment_id,
          subscriptionId,
          amount: data.total_amount / 100,
          currency: data.currency,
          status: "pending",
          method: data.payment_method,
        },
      });

      if (subscriptionId) {
        await prisma.subscription.upsert({
          where: {
            subscriptionId
          },
          update: {
            plan,
            status: "pending",
          },
          create: {
            user: {
              connect: {
                id: userId
              }
            },
            plan,
            status: "pending",
            subscriptionId,
            customerId,
          },
        });
      }
    }


    if (event === "subscription.renewed") {
      const expiryDate = new Date();
      if (user.planType === "ANNUALLY") {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          planExpiresAt: expiryDate,
          billingStatus: "active",
        },
      });

      await sendEmail(
        user.email,
        "Subscription renewed - FastURL",
        user.userName || "",
        "Subscription Renewed",
        `Your premium subscription has been successfully renewed. Thank you for continuing with FastURL!`
      );

      if (subscriptionId) {
        await prisma.subscription.update({
          where: {
            subscriptionId
          },
          data: {
            planEndedAt: expiryDate,
            status: "active",
          },
        });
      }
    }

    if (event === "subscription.cancelled") {
      const limits = PLAN_LIMITS["FREE"];

      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          plan: "FREE",
          totalLinks: limits.links,
          totalQr: limits.qr,
          billingStatus: "cancelled",
          subscriptionId: null,
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          title: "Subscription Cancelled",
          message: "Your premium subscription has been cancelled. Your account has been reverted to the Free plan.",
          metadata: { event: "subscription_cancelled" },
          actionUrl: "/premium"
        }
      });

      await sendEmail(
        user.email,
        "Subscription cancelled - FastURL",
        user.userName || "",
        "Subscription Cancelled",
        "Your premium subscription has been cancelled. Your account has been reverted to the Free plan. We're sorry to see you go!"
      );
    }

    if (event === "payment.refunded") {
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          plan: "FREE",
          billingStatus: "refunded",
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          title: "Payment Refunded",
          message: "Your payment has been refunded, and your account has been reverted to the Free plan.",
          metadata: { event: "payment_refunded" },
          actionUrl: "/premium"
        }
      });

      await sendEmail(
        user.email,
        "Payment refunded - FastURL",
        user.userName || "",
        "Payment Refunded",
        "Your payment has been refunded, and your account has been reverted to the Free plan."
      );
    }

    if (event === "subscription.expired") {
      const limits = PLAN_LIMITS["FREE"];

      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          plan: "FREE",
          totalLinks: limits.links,
          totalQr: limits.qr,
          billingStatus: "expired",
          subscriptionId: null,
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          title: "Subscription Expired",
          message: "Your premium subscription has expired. Your account has been reverted to the Free plan.",
          metadata: { event: "subscription_expired" },
          actionUrl: "/premium"
        }
      });

      await sendEmail(
        user.email,
        "Subscription expired - FastURL",
        user.userName || "",
        "Subscription Expired",
        "Your premium subscription has expired. Your account has been reverted to the Free plan. Renew your subscription to continue enjoying premium features!"
      );
    }

    console.log("EVENT:", event);
    console.log("PAYMENT ID:", data?.payment_id);
    console.log("SUBSCRIPTION ID:", data?.subscription_id);

    return NextResponse.json({ received: true });

  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
