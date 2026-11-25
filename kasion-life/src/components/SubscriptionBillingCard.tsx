import React from "react";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  downgradeToFreePlan,
} from "@/app/actions/billing";
import { PlanTier, PLAN_DETAILS } from "@/lib/stripe";

interface SubscriptionBillingCardProps {
  plan: PlanTier;
  billingInterval: string | null;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  currentPeriodEnd: Date | null;
  isStripeLiveConfigured: boolean;
  checkoutStatus?: string;
  selectedPlanParam?: string;
  isSandboxCheckout?: boolean;
  portalStatus?: string;
}

export default function SubscriptionBillingCard({
  plan,
  billingInterval,
  subscriptionStatus,
  stripeCustomerId,
  currentPeriodEnd,
  isStripeLiveConfigured,
  checkoutStatus,
  selectedPlanParam,
  isSandboxCheckout,
  portalStatus,
}: SubscriptionBillingCardProps) {
  const details = PLAN_DETAILS[plan];

  const formattedPeriodEnd = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "2rem",
        borderRadius: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <style>{`
        .billing-header-row {
          display: flex;
          align-items: safe center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .billing-plan-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1rem;
          inline-size: 100%;
        }
        .billing-option-card {
          grid-row: span 3;
          display: grid;
          grid-template-rows: auto 1fr auto;
          grid-template-rows: subgrid;
          gap: 0.875rem;
          padding: 1.25rem;
          border-radius: 1rem;
          background-color: var(--muted-bg);
          border: 1px solid var(--border);
        }
        .billing-option-card.active-tier {
          border-color: var(--accent);
          background: linear-gradient(
            180deg,
            rgba(99, 102, 241, 0.1) 0%,
            var(--muted-bg) 100%
          );
        }
        .billing-option-card.lifetime-tier {
          border-color: rgba(16, 185, 129, 0.4);
        }
      `}</style>

      {/* Top Header & Active Plan Badge */}
      <div className="billing-header-row">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>
              Subscription &amp; Billing (Stripe)
            </h2>
            <span
              style={{
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                padding: "0.2rem 0.65rem",
                borderRadius: "999px",
                backgroundColor:
                  plan === "LIFETIME"
                    ? "rgba(16, 185, 129, 0.14)"
                    : plan === "PRO"
                    ? "rgba(99, 102, 241, 0.16)"
                    : "var(--muted-bg)",
                color:
                  plan === "LIFETIME"
                    ? "#10b981"
                    : plan === "PRO"
                    ? "var(--accent)"
                    : "var(--muted)",
                border:
                  plan === "LIFETIME"
                    ? "1px solid rgba(16, 185, 129, 0.35)"
                    : plan === "PRO"
                    ? "1px solid rgba(99, 102, 241, 0.35)"
                    : "1px solid var(--border)",
                textTransform: "uppercase",
              }}
            >
              {details.name} • {details.badge}
            </span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            {details.description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 0.75rem",
            borderRadius: "0.65rem",
            backgroundColor: "var(--muted-bg)",
            border: "1px solid var(--border)",
            fontSize: "0.725rem",
            fontFamily: "var(--font-mono)",
            color: "var(--muted)",
          }}
        >
          <span
            style={{
              inlineSize: "8px",
              blockSize: "8px",
              borderRadius: "999px",
              backgroundColor: isStripeLiveConfigured ? "#10b981" : "#f59e0b",
            }}
          />
          <span>
            {isStripeLiveConfigured
              ? "Stripe API Connected"
              : "Stripe Dev Sandbox Mode"}
          </span>
        </div>
      </div>

      {/* Feedback Alerts from Checkout or Portal Redirects */}
      {checkoutStatus === "success" && (
        <div
          role="status"
          style={{
            padding: "0.9rem 1.15rem",
            borderRadius: "0.875rem",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#10b981",
            fontSize: "0.85rem",
            fontWeight: "600",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <div>
            ✓ Workspace upgraded to{" "}
            {selectedPlanParam === "lifetime"
              ? "Founder Edition (Lifetime)"
              : "Kasion Pro"}
            !
          </div>
          {isSandboxCheckout && (
            <span style={{ fontSize: "0.75rem", opacity: 0.9, fontWeight: "400" }}>
              Completed via Local Developer Sandbox. Set <code>STRIPE_SECRET_KEY</code> in{" "}
              <code>.env.local</code> to use hosted Stripe Checkout sessions.
            </span>
          )}
        </div>
      )}

      {checkoutStatus === "canceled" && (
        <div
          role="status"
          style={{
            padding: "0.85rem 1.15rem",
            borderRadius: "0.875rem",
            backgroundColor: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            color: "#f59e0b",
            fontSize: "0.85rem",
          }}
        >
          Stripe Checkout was canceled. Your workspace plan has not been changed.
        </div>
      )}

      {checkoutStatus === "downgraded" && (
        <div
          role="status"
          style={{
            padding: "0.85rem 1.15rem",
            borderRadius: "0.875rem",
            backgroundColor: "var(--muted-bg)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            fontSize: "0.85rem",
          }}
        >
          Your workspace has been switched back to the Starter OS (Free) tier.
        </div>
      )}

      {portalStatus === "sandbox" && (
        <div
          role="status"
          style={{
            padding: "0.85rem 1.15rem",
            borderRadius: "0.875rem",
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            color: "var(--accent)",
            fontSize: "0.825rem",
          }}
        >
          Running in Local Sandbox Mode: Use the plan cards or the downgrade button below to test switching tiers immediately. When <code>STRIPE_SECRET_KEY</code> is configured, this button opens the hosted Stripe Customer Billing Portal.
        </div>
      )}

      {/* Current Subscription Metadata Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          borderRadius: "0.875rem",
          backgroundColor: "var(--muted-bg)",
          border: "1px solid var(--border)",
          fontSize: "0.8rem",
        }}
      >
        <div>
          <div style={{ color: "var(--muted)", fontSize: "0.7rem", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
            Active Tier
          </div>
          <div style={{ fontWeight: "700", marginTop: "0.2rem" }}>{details.name}</div>
        </div>

        <div>
          <div style={{ color: "var(--muted)", fontSize: "0.7rem", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
            Billing Cycle
          </div>
          <div style={{ fontWeight: "700", marginTop: "0.2rem", textTransform: "capitalize" }}>
            {plan === "FREE"
              ? "Free Forever ($0)"
              : billingInterval === "lifetime"
              ? "One-Time Lifetime ($149)"
              : billingInterval === "monthly"
              ? "Monthly ($10/mo)"
              : "Annual ($96/yr • $8/mo)"}
          </div>
        </div>

        <div>
          <div style={{ color: "var(--muted)", fontSize: "0.7rem", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
            Status
          </div>
          <div style={{ fontWeight: "700", marginTop: "0.2rem", textTransform: "capitalize" }}>
            {plan === "FREE"
              ? "Active"
              : subscriptionStatus === "trialing"
              ? `14-Day Trial${formattedPeriodEnd ? ` (Ends ${formattedPeriodEnd})` : ""}`
              : subscriptionStatus || "Active"}
          </div>
        </div>

        <div>
          <div style={{ color: "var(--muted)", fontSize: "0.7rem", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
            Stripe Customer ID
          </div>
          <div style={{ fontWeight: "600", fontFamily: "var(--font-mono)", marginTop: "0.2rem", fontSize: "0.75rem" }}>
            {stripeCustomerId || "Not yet created"}
          </div>
        </div>
      </div>

      {/* 3-Column Subgrid Checkout / Upgrade Options */}
      <div className="billing-plan-grid">
        {/* Option 1: Kasion Pro Annual */}
        <div
          className={`billing-option-card ${
            plan === "PRO" && billingInterval === "annual" ? "active-tier" : ""
          }`}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: "800", color: "var(--accent)", textTransform: "uppercase" }}>
                Kasion Pro • Annual
              </span>
              <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", padding: "0.15rem 0.5rem", borderRadius: "999px", backgroundColor: "rgba(99, 102, 241, 0.16)", color: "var(--accent)", fontWeight: "700" }}>
                Save 20%
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "1.65rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>$8</span>
              <span style={{ fontSize: "0.775rem", color: "var(--muted)" }}>/ mo ($96/yr)</span>
            </div>
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: "1.5" }}>
            Includes 14-day free trial, unlimited habits &amp; 12-Week Goals, 365-day heatmaps, and Google Calendar sync.
          </p>

          <form action={createCheckoutSession}>
            <input type="hidden" name="planOption" value="pro_annual" />
            <button
              type="submit"
              disabled={plan === "PRO" && billingInterval === "annual"}
              className="login-btn"
              style={{
                inlineSize: "100%",
                padding: "0.65rem 1rem",
                fontSize: "0.8rem",
                opacity: plan === "PRO" && billingInterval === "annual" ? 0.6 : 1,
                cursor:
                  plan === "PRO" && billingInterval === "annual"
                    ? "default"
                    : "pointer",
              }}
            >
              {plan === "PRO" && billingInterval === "annual"
                ? "Current Active Plan"
                : "Checkout Pro Annual →"}
            </button>
          </form>
        </div>

        {/* Option 2: Kasion Pro Monthly */}
        <div
          className={`billing-option-card ${
            plan === "PRO" && billingInterval === "monthly" ? "active-tier" : ""
          }`}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: "800", color: "var(--foreground)", textTransform: "uppercase" }}>
                Kasion Pro • Monthly
              </span>
              <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                Flexible
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "1.65rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>$10</span>
              <span style={{ fontSize: "0.775rem", color: "var(--muted)" }}>/ month</span>
            </div>
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: "1.5" }}>
            Month-to-month access to the full Kasion Pro execution stack with a 14-day free trial. Cancel anytime.
          </p>

          <form action={createCheckoutSession}>
            <input type="hidden" name="planOption" value="pro_monthly" />
            <button
              type="submit"
              disabled={plan === "PRO" && billingInterval === "monthly"}
              style={{
                inlineSize: "100%",
                padding: "0.65rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                fontSize: "0.8rem",
                fontWeight: "700",
                opacity: plan === "PRO" && billingInterval === "monthly" ? 0.6 : 1,
                cursor:
                  plan === "PRO" && billingInterval === "monthly"
                    ? "default"
                    : "pointer",
              }}
            >
              {plan === "PRO" && billingInterval === "monthly"
                ? "Current Active Plan"
                : "Checkout Pro Monthly →"}
            </button>
          </form>
        </div>

        {/* Option 3: Founder Lifetime */}
        <div
          className={`billing-option-card lifetime-tier ${
            plan === "LIFETIME" ? "active-tier" : ""
          }`}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: "800", color: "#10b981", textTransform: "uppercase" }}>
                Founder Edition
              </span>
              <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", padding: "0.15rem 0.5rem", borderRadius: "999px", backgroundColor: "rgba(16, 185, 129, 0.14)", color: "#10b981", fontWeight: "700" }}>
                One-Time
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "1.65rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>$149</span>
              <span style={{ fontSize: "0.775rem", color: "var(--muted)" }}>/ lifetime</span>
            </div>
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: "1.5" }}>
            Pay once, own Kasion Pro forever with zero recurring subscription fees and full SQLite snapshot exports.
          </p>

          <form action={createCheckoutSession}>
            <input type="hidden" name="planOption" value="lifetime" />
            <button
              type="submit"
              disabled={plan === "LIFETIME"}
              style={{
                inlineSize: "100%",
                padding: "0.65rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid rgba(16, 185, 129, 0.45)",
                backgroundColor:
                  plan === "LIFETIME"
                    ? "rgba(16, 185, 129, 0.12)"
                    : "rgba(16, 185, 129, 0.16)",
                color: "#10b981",
                fontSize: "0.8rem",
                fontWeight: "700",
                opacity: plan === "LIFETIME" ? 0.7 : 1,
                cursor: plan === "LIFETIME" ? "default" : "pointer",
              }}
            >
              {plan === "LIFETIME"
                ? "Founder Pass Active ✓"
                : "Claim Founder Pass ($149) →"}
            </button>
          </form>
        </div>
      </div>

      {/* Portal & Cancellation Footer Actions */}
      {plan !== "FREE" && (
        <div
          style={{
            display: "flex",
            alignItems: "safe center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            paddingBlockStart: "0.5rem",
            borderBlockStart: "1px solid var(--border)",
          }}
        >
          <form action={createCustomerPortalSession}>
            <button
              type="submit"
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "0.65rem",
                border: "1px solid var(--border)",
                backgroundColor: "var(--muted-bg)",
                color: "var(--foreground)",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Manage Billing &amp; Invoices (Stripe Portal) ↗
            </button>
          </form>

          <form action={downgradeToFreePlan}>
            <button
              type="submit"
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "0.65rem",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                backgroundColor: "transparent",
                color: "#ef4444",
                fontSize: "0.775rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Switch Back to Starter Free Tier
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
