import React from "react";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HealthWidget, { SerializedHealthLog } from "@/components/HealthWidget";

export default async function HealthPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch today's health log
  const todayLog = await db.healthLog.findUnique({
    where: {
      userId_date: {
        userId: session.userId,
        date: today,
      },
    },
  });

  // Fetch recent health logs (up to 14 days including today)
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 14);

  const recentLogs = await db.healthLog.findMany({
    where: {
      userId: session.userId,
      date: {
        gte: fourteenDaysAgo,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const serializeLog = (
    log: NonNullable<typeof todayLog> | null,
    fallbackDate: Date
  ): SerializedHealthLog => ({
    id: log?.id ?? "today-draft",
    date: (log?.date ?? fallbackDate).toISOString(),
    sleepHours: log?.sleepHours ?? 0,
    sleepQuality: log?.sleepQuality ?? 3,
    waterIntake: log?.waterIntake ?? 0,
    energyLevel: log?.energyLevel ?? 5,
    steps: log?.steps ?? 0,
    workoutMinutes: log?.workoutMinutes ?? 0,
    workoutType: log?.workoutType ?? "NONE",
    mood: log?.mood ?? "CALM",
    stressLevel: log?.stressLevel ?? 3,
    calories: log?.calories ?? 0,
    proteinGrams: log?.proteinGrams ?? 0,
    caffeineCups: log?.caffeineCups ?? 0,
    weightLbs: log?.weightLbs ?? null,
    restingHeartRate: log?.restingHeartRate ?? null,
    mindfulnessMinutes: log?.mindfulnessMinutes ?? 0,
    sunlightMinutes: log?.sunlightMinutes ?? 0,
    supplementsTaken: log?.supplementsTaken ?? "",
    notes: log?.notes ?? "",
  });

  const serializedToday = serializeLog(todayLog, today);
  const serializedHistory = recentLogs.map((l) => serializeLog(l, l.date));

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem", inlineSize: "100%" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Health &amp; Wellness OS
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Track your daily readiness score, sleep architecture, movement, nutrition, cardiovascular vitals, and recovery stack.
        </p>
      </div>

      {/* Comprehensive Interactive Health & Biometric Tracker */}
      <HealthWidget
        initialTodayLog={serializedToday}
        initialHistoryLogs={serializedHistory}
      />
    </div>
  );
}
