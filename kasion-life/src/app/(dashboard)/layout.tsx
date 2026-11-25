import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";

export default async function DashboardGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  let userName: string | null = null;
  let userEmail: string | null = null;
  let userPlan: string = "FREE";

  if (session?.userId) {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { name: true, email: true, plan: true },
    });
    userName = user?.name ?? null;
    userEmail = user?.email ?? null;
    userPlan = user?.plan ?? "FREE";
  }

  return (
    <DashboardLayout
      userName={userName}
      userEmail={userEmail}
      userPlan={userPlan}
    >
      {children}
    </DashboardLayout>
  );
}
