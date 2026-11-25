import React from "react";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import JournalEditor, { SerializedJournalEntry } from "@/components/JournalEditor";

export default async function JournalPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Fetch all saved entries for this user (including today's and past entries)
  const entries = await db.journalEntry.findMany({
    where: {
      userId: session.userId,
    },
    orderBy: [
      { date: "desc" },
      { createdAt: "desc" },
    ],
    take: 50,
  });

  const serializedEntries: SerializedJournalEntry[] = entries
    .filter((entry) => entry.content.trim().length > 0)
    .map((entry) => ({
      id: entry.id,
      date: entry.date.toISOString(),
      content: entry.content,
      createdAt: entry.createdAt.toISOString(),
    }));

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Daily Journal
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Capture ideas, reflect on daily lessons, and revisit all your saved reflection logs below.
        </p>
      </div>

      {/* Unified Editor + Interactive Saved Logs Archive */}
      <JournalEditor initialEntries={serializedEntries} />
    </div>
  );
}
