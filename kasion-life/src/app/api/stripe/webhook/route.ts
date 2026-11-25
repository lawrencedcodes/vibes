import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured on this server." },
      { status: 400 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing stripe-signature header or STRIPE_WEBHOOK_SECRET." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook Signature Error]:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          session.metadata?.userId || session.client_reference_id || null;
        const planOption = session.metadata?.planOption || "pro_annual";
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id || null;

        if (!userId) break;

        if (session.mode === "payment" || planOption === "lifetime") {
          await db.user.update({
            where: { id: userId },
            data: {
              plan: "LIFETIME",
              billingInterval: "lifetime",
              subscriptionStatus: "active",
              ...(customerId ? { stripeCustomerId: customerId } : {}),
              stripePriceId: "lifetime",
            },
          });
        } else if (session.mode === "subscription") {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id || null;

          let periodEnd: Date | null = null;
          let status = "active";

          if (subscriptionId) {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            status = sub.status;
            const firstItemPeriodEnd = sub.items?.data?.[0]?.current_period_end;
            if (firstItemPeriodEnd) {
              periodEnd = new Date(firstItemPeriodEnd * 1000);
            }
          }

          await db.user.update({
            where: { id: userId },
            data: {
              plan: "PRO",
              billingInterval:
                planOption === "pro_monthly" ? "monthly" : "annual",
              subscriptionStatus: status,
              ...(customerId ? { stripeCustomerId: customerId } : {}),
              ...(subscriptionId
                ? { stripeSubscriptionId: subscriptionId }
                : {}),
              stripePriceId: planOption,
              stripeCurrentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        const firstItem = subscription.items?.data?.[0];
        const periodEnd = firstItem?.current_period_end
          ? new Date(firstItem.current_period_end * 1000)
          : null;
        const interval =
          firstItem?.price?.recurring?.interval === "month"
            ? "monthly"
            : "annual";

        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        await db.user.updateMany({
          where: {
            OR: [
              { stripeSubscriptionId: subscriptionId },
              ...(customerId ? [{ stripeCustomerId: customerId }] : []),
            ],
          },
          data: {
            plan: isActive ? "PRO" : "FREE",
            billingInterval: isActive ? interval : null,
            subscriptionStatus: subscription.status,
            stripeSubscriptionId: subscriptionId,
            stripeCurrentPeriodEnd: periodEnd,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        await db.user.updateMany({
          where: {
            stripeSubscriptionId: subscriptionId,
            plan: { not: "LIFETIME" },
          },
          data: {
            plan: "FREE",
            billingInterval: null,
            subscriptionStatus: "canceled",
            stripeSubscriptionId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      }
    }
  } catch (error) {
    console.error("[Stripe Webhook Processing Error]:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
