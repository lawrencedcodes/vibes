"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import {
  stripe,
  isStripeConfigured,
  getAppBaseUrl,
  CheckoutPlanOption,
} from "@/lib/stripe";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCheckoutSession(formData: FormData) {
  const rawOption = (formData.get("planOption") as string) || "pro_annual";
  const planOption: CheckoutPlanOption =
    rawOption === "pro_monthly" || rawOption === "lifetime"
      ? rawOption
      : "pro_annual";

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    if (planOption === "lifetime") {
      redirect("/signup?plan=lifetime");
    }
    const billing = planOption === "pro_monthly" ? "monthly" : "annual";
    redirect(`/signup?plan=pro&billing=${billing}`);
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  let redirectUrl = "/settings";

  // 1. Live / Test Stripe Checkout Mode
  if (isStripeConfigured && stripe) {
    try {
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;

        await db.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      }

      const baseUrl = getAppBaseUrl();
      const isLifetime = planOption === "lifetime";
      const isAnnual = planOption === "pro_annual";

      const configuredPriceId = isLifetime
        ? process.env.STRIPE_PRICE_LIFETIME
        : isAnnual
        ? process.env.STRIPE_PRICE_PRO_ANNUAL
        : process.env.STRIPE_PRICE_PRO_MONTHLY;

      const lineItem = configuredPriceId
        ? { price: configuredPriceId, quantity: 1 }
        : isLifetime
        ? {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: 14900, // $149.00
              product_data: {
                name: "KasionLife Founder Edition (Lifetime Pass)",
                description:
                  "One-time payment for permanent Kasion Pro access, 365-day heatmaps, and Google Calendar sync.",
              },
            },
          }
        : {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: isAnnual ? 9600 : 1000, // $96/year ($8/mo) or $10/month
              recurring: {
                interval: (isAnnual ? "year" : "month") as "year" | "month",
              },
              product_data: {
                name: isAnnual
                  ? "Kasion Pro (Annual Billing)"
                  : "Kasion Pro (Monthly Billing)",
                description:
                  "Unlimited habits, 12-Week Year goals, 365-day heatmaps, and 2-way Google Calendar sync.",
              },
            },
          };

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: user.id,
        mode: isLifetime ? "payment" : "subscription",
        line_items: [lineItem],
        ...(isLifetime
          ? {}
          : {
              subscription_data: {
                trial_period_days: 14,
                metadata: {
                  userId: user.id,
                  planOption,
                },
              },
            }),
        metadata: {
          userId: user.id,
          planOption,
        },
        success_url: `${baseUrl}/settings?checkout=success&plan=${planOption}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/settings?checkout=canceled`,
      });

      if (checkoutSession.url) {
        redirectUrl = checkoutSession.url;
      }
    } catch (error) {
      console.error("[Stripe Checkout Error]:", error);
      redirect("/settings?checkout=error");
    }

    redirect(redirectUrl);
  }

  // 2. Local Developer Sandbox Mode (when STRIPE_SECRET_KEY is not set)
  const isLifetime = planOption === "lifetime";
  const isAnnual = planOption === "pro_annual";
  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() + (isLifetime ? 36500 : 14));

  await db.user.update({
    where: { id: user.id },
    data: {
      plan: isLifetime ? "LIFETIME" : "PRO",
      billingInterval: isLifetime ? "lifetime" : isAnnual ? "annual" : "monthly",
      subscriptionStatus: isLifetime ? "active" : "trialing",
      stripeCustomerId: user.stripeCustomerId || `cus_sandbox_${user.id.slice(0, 8)}`,
      stripeSubscriptionId: isLifetime
        ? null
        : `sub_sandbox_${user.id.slice(0, 8)}`,
      stripePriceId: planOption,
      stripeCurrentPeriodEnd: isLifetime ? null : periodEnd,
    },
  });

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/pricing");
  revalidatePath("/welcome");
  revalidatePath("/tracker");
  revalidatePath("/goals");
  revalidatePath("/planner");

  redirect(`/settings?checkout=success&plan=${planOption}&sandbox=1`);
}

export async function createCustomerPortalSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  if (
    isStripeConfigured &&
    stripe &&
    user.stripeCustomerId &&
    !user.stripeCustomerId.startsWith("cus_sandbox_")
  ) {
    let portalUrl = "/settings";
    try {
      const baseUrl = getAppBaseUrl();
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${baseUrl}/settings`,
      });
      portalUrl = portalSession.url;
    } catch (error) {
      console.error("[Stripe Billing Portal Error]:", error);
      redirect("/settings?checkout=portal_error");
    }
    redirect(portalUrl);
  }

  redirect("/settings?portal=sandbox");
}

export async function downgradeToFreePlan() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  try {
    if (
      isStripeConfigured &&
      stripe &&
      user.stripeSubscriptionId &&
      !user.stripeSubscriptionId.startsWith("sub_sandbox_")
    ) {
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        plan: "FREE",
        billingInterval: null,
        subscriptionStatus: "canceled",
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      },
    });
  } catch (error) {
    console.error("[Downgrade Plan Error]:", error);
  }

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/pricing");
  revalidatePath("/welcome");
  revalidatePath("/tracker");
  revalidatePath("/goals");

  redirect("/settings?checkout=downgraded");
}
