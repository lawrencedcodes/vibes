import "server-only";
import Stripe from "stripe";
import { db } from "@/lib/db";

export type PlanTier = "FREE" | "PRO" | "LIFETIME";
export type CheckoutPlanOption = "pro_monthly" | "pro_annual" | "lifetime";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const isStripeConfigured = Boolean(
  stripeSecretKey && !stripeSecretKey.includes("your_stripe_secret_key")
);

export const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey, {
      typescript: true,
    })
  : null;

export const PLAN_DETAILS: Record<
  PlanTier,
  {
    name: string;
    badge: string;
    description: string;
    maxHabits: number;
    maxActiveGoals: number;
    hasFullYearHeatmap: boolean;
    hasGoogleCalendarSync: boolean;
  }
> = {
  FREE: {
    name: "Starter OS",
    badge: "Free Tier",
    description: "Up to 3 active habits, 1 active 12-Week Goal, focus timer & daily reflections.",
    maxHabits: 3,
    maxActiveGoals: 1,
    hasFullYearHeatmap: false,
    hasGoogleCalendarSync: false,
  },
  PRO: {
    name: "Kasion Pro",
    badge: "Pro Member",
    description: "Unlimited habits & 12-Week Goals, 365-day contribution heatmaps, and 2-way Google Calendar sync.",
    maxHabits: Infinity,
    maxActiveGoals: Infinity,
    hasFullYearHeatmap: true,
    hasGoogleCalendarSync: true,
  },
  LIFETIME: {
    name: "Founder Edition",
    badge: "Lifetime Pass",
    description: "Permanent lifetime access to all Kasion Pro features, local snapshot exports, and founder updates.",
    maxHabits: Infinity,
    maxActiveGoals: Infinity,
    hasFullYearHeatmap: true,
    hasGoogleCalendarSync: true,
  },
};

export function normalizePlanTier(plan?: string | null): PlanTier {
  if (plan === "PRO") return "PRO";
  if (plan === "LIFETIME") return "LIFETIME";
  return "FREE";
}

export function getAppBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function syncCheckoutSessionIfPresent(
  userId: string,
  sessionId?: string
): Promise<void> {
  if (!sessionId || !stripe) return;

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (
      checkoutSession.client_reference_id !== userId &&
      checkoutSession.metadata?.userId !== userId
    ) {
      return;
    }

    if (
      checkoutSession.payment_status !== "paid" &&
      checkoutSession.payment_status !== "no_payment_required"
    ) {
      return;
    }

    const planOption = checkoutSession.metadata?.planOption || "pro_annual";
    const customerId =
      typeof checkoutSession.customer === "string"
        ? checkoutSession.customer
        : checkoutSession.customer?.id || null;

    if (checkoutSession.mode === "payment" || planOption === "lifetime") {
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
    } else if (checkoutSession.mode === "subscription") {
      const subscriptionId =
        typeof checkoutSession.subscription === "string"
          ? checkoutSession.subscription
          : checkoutSession.subscription?.id || null;

      await db.user.update({
        where: { id: userId },
        data: {
          plan: "PRO",
          billingInterval:
            planOption === "pro_monthly" ? "monthly" : "annual",
          subscriptionStatus: "trialing",
          ...(customerId ? { stripeCustomerId: customerId } : {}),
          ...(subscriptionId ? { stripeSubscriptionId: subscriptionId } : {}),
          stripePriceId: planOption,
        },
      });
    }
  } catch (error) {
    console.error("[Stripe Session Sync Error]:", error);
  }
}

