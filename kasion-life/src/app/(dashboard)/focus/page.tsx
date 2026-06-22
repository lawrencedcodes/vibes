import React from "react";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TimerWidget from "@/components/TimerWidget";
import FocusTimeline from "@/components/FocusTimeline";

export default async function FocusPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Fetch active incomplete todos for selection
  const todos = await db.todo.findMany({
    where: {
      list: { userId: session.userId },
      isCompleted: false,
    },
    select: {
      id: true,
      content: true,
    },
  });

  // Calculate local server midnight limits for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Fetch completed focus sessions logged today
  const focusSessions = await db.focusSession.findMany({
    where: {
      userId: session.userId,
      startTime: {
        gte: today,
        lt: tomorrow,
      },
      status: "COMPLETED",
    },
    include: {
      todo: {
        select: {
          content: true,
        },
      },
    },
    orderBy: {
      startTime: "desc",
    },
  });

  // Serialize datasets to prevent Next.js date serialization mismatch in client components
  const serializedTodos = todos;
  const serializedSessions = focusSessions.map((fs) => ({
    id: fs.id,
    startTime: fs.startTime.toISOString(),
    endTime: fs.endTime?.toISOString() || null,
    duration: fs.duration,
    todoContent: fs.todo?.content || null,
  }));

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Focus Space
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Lock in uninterrupted intervals using a 25-minute Pomodoro timer, and link focus sessions to tasks.
        </p>
      </div>

      {/* Dynamic Grid layout */}
      <div className="metric-grid" style={{ alignItems: "start" }}>
        {/* Column 1: Interactive Timer Widget */}
        <TimerWidget activeTodos={serializedTodos} />
        
        {/* Column 2: Focus Timeline and stats */}
        <FocusTimeline sessions={serializedSessions} />
      </div>
    </div>
  );
}
