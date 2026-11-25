import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import {
  isStripeConfigured,
  normalizePlanTier,
  syncCheckoutSessionIfPresent,
} from "@/lib/stripe";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import SubscriptionBillingCard from "@/components/SubscriptionBillingCard";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const checkoutStatus =
    typeof resolvedParams.checkout === "string"
      ? resolvedParams.checkout
      : undefined;
  const selectedPlanParam =
    typeof resolvedParams.plan === "string" ? resolvedParams.plan : undefined;
  const isSandboxCheckout = resolvedParams.sandbox === "1";
  const portalStatus =
    typeof resolvedParams.portal === "string"
      ? resolvedParams.portal
      : undefined;
  const sessionIdParam =
    typeof resolvedParams.session_id === "string"
      ? resolvedParams.session_id
      : undefined;

  if (sessionIdParam) {
    await syncCheckoutSessionIfPresent(session.userId, sessionIdParam);
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      plan: true,
      billingInterval: true,
      subscriptionStatus: true,
      stripeCustomerId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  const activePlan = normalizePlanTier(user?.plan);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Settings &amp; Configurations
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Configure user profile settings, Stripe subscription billing, and export databases.
        </p>
      </div>

      {/* Subscription & Stripe Billing Card */}
      <SubscriptionBillingCard
        plan={activePlan}
        billingInterval={user?.billingInterval ?? null}
        subscriptionStatus={user?.subscriptionStatus ?? null}
        stripeCustomerId={user?.stripeCustomerId ?? null}
        currentPeriodEnd={user?.stripeCurrentPeriodEnd ?? null}
        isStripeLiveConfigured={isStripeConfigured}
        checkoutStatus={checkoutStatus}
        selectedPlanParam={selectedPlanParam}
        isSandboxCheckout={isSandboxCheckout}
        portalStatus={portalStatus}
      />

      {/* Account Profile & Onboarding Card */}
      <ProfileSettingsForm
        initialName={user?.name || ""}
        email={user?.email || ""}
      />

      {/* General Settings Card */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>System Details</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.15rem" }}>
            Review baseline parameters for local compilation.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Domain Target</span>
            <span style={{ fontSize: "0.875rem", fontWeight: "600", fontFamily: "var(--font-mono)" }}>kasionlife.com</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Build Mode</span>
            <span style={{ fontSize: "0.875rem", fontWeight: "600", fontFamily: "var(--font-mono)" }}>Next.js App Router (Static/PPR Ready)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Next.js Directory version</span>
            <span style={{ fontSize: "0.875rem", fontWeight: "600", fontFamily: "var(--font-mono)" }}>v16+ (Canary Doc-Enabled)</span>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Data Portability</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.15rem" }}>
            Export or erase metrics and logs recorded inside the browser workspace.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={{
            backgroundColor: "var(--accent)",
            border: "none",
            color: "var(--accent-foreground)",
            padding: "0.625rem 1.25rem",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Export Logs (JSON)
          </button>
          <button style={{
            backgroundColor: "transparent",
            border: "1px solid #ef4444",
            color: "#ef4444",
            padding: "0.625rem 1.25rem",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Clear Browser Database
          </button>
        </div>
      </div>
    </div>
  );
}
