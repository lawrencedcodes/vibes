import React from "react";
import { JournalIcon } from "@/components/Icons";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import JournalEditor from "@/components/JournalEditor";

export default async function JournalPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch today's entry
  const todayEntry = await db.journalEntry.findUnique({
    where: {
      userId_date: {
        userId: session.userId,
        date: today,
      },
    },
  });

  // Fetch past entries
  const pastEntries = await db.journalEntry.findMany({
    where: {
      userId: session.userId,
      date: {
        lt: today,
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 10, // Limit to 10 past entries
  });

  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const getPreviewTitle = (content: string) => {
    const firstLine = content.trim().split("\n")[0];
    if (!firstLine) return "Empty entry";
    return firstLine.length > 80 ? firstLine.substring(0, 80) + "..." : firstLine;
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Daily Journal
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Capture ideas, reflect on daily lessons, and record key thoughts.
        </p>
      </div>

      {/* Editor Component */}
      <JournalEditor initialContent={todayEntry?.content || ""} />

      {/* History */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Past Logs</h3>
        {pastEntries.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", fontStyle: "italic" }}>
            No past journal entries yet. Start writing today!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pastEntries.map((entry) => (
              <div key={entry.id} className="glass-panel" style={{ padding: "1.25rem", borderRadius: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {formatDate(entry.date)}
                  </span>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginTop: "0.15rem", color: "var(--foreground)" }}>
                    {getPreviewTitle(entry.content)}
                  </h4>
                </div>
                <span style={{ color: "var(--muted)" }}><JournalIcon size={16} /></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

