import React from "react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import LandingPricingPage from "@/components/LandingPricingPage";

export default async function WelcomePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  let userName: string | null = null;
  let userPlan: string = "FREE";
  if (session?.userId) {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { name: true, plan: true },
    });
    userName = user?.name ?? null;
    userPlan = user?.plan ?? "FREE";
  }

  return (
    <LandingPricingPage
      isAuthenticated={Boolean(session?.userId)}
      userName={userName}
      userPlan={userPlan}
      focusPricing={false}
    />
  );
}
