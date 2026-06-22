import React from "react";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HealthWidget from "@/components/HealthWidget";

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

  // Fetch logs for the past 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const pastLogs = await db.healthLog.findMany({
    where: {
      userId: session.userId,
      date: {
        lt: today,
        gte: sevenDaysAgo,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "600px" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Health & Wellness
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Monitor your daily physical vitals, energy levels, and sleep patterns.
        </p>
      </div>

      {/* Interactive Tracker Widget */}
      <HealthWidget
        initialSleep={todayLog?.sleepHours ?? 0}
        initialWater={todayLog?.waterIntake ?? 0}
        initialEnergy={todayLog?.energyLevel ?? 5}
      />

      {/* History */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Past 7 Days</h3>
        {pastLogs.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", fontStyle: "italic" }}>
            No health logs found for the past week. Consistent tracking builds wellness!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pastLogs.map((log) => (
              <div key={log.id} className="glass-panel" style={{
                padding: "1rem 1.25rem",
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "var(--card-bg)"
              }}>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {formatDate(log.date)}
                  </span>
                  <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.35rem", fontSize: "0.815rem", color: "var(--foreground)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      💧 <strong>{log.waterIntake}</strong> gl
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      😴 <strong>{log.sleepHours}</strong> hrs
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      ⚡ <strong>{log.energyLevel}</strong>/10
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
