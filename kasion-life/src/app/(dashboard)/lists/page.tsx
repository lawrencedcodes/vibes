import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import ListForm from "@/components/ListForm";
import Link from "next/link";

export default async function ListsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Fetch user's custom lists along with linked project and task counts
  const lists = await db.list.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        select: {
          id: true,
          title: true,
        },
      },
      todos: {
        select: {
          id: true,
          isCompleted: true,
        },
      },
    },
  });

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
            My Lists
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            Click any list below to add Tasks &amp; Subtasks—incomplete tasks automatically feed your Focus Space Pomodoro timer.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link
            href="/projects"
            style={{
              padding: "0.55rem 0.9rem",
              borderRadius: "0.65rem",
              backgroundColor: "var(--muted-bg)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              fontSize: "0.76rem",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            📁 View Projects
          </Link>
          <Link
            href="/focus"
            style={{
              padding: "0.55rem 0.9rem",
              borderRadius: "0.65rem",
              backgroundColor: "var(--accent)",
              color: "#ffffff",
              fontSize: "0.76rem",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            ⏱️ Open Focus Space →
          </Link>
        </div>
      </div>

      {/* Quick Add Form Container */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "1.25rem" }}>
        <ListForm />
      </div>

      {/* Grid of Lists */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Active Lists</h2>

        {lists.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem 2rem", borderRadius: "1.25rem", borderStyle: "dashed", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              No custom lists created yet. Enter a title above or create a list inside a Project workspace.
            </p>
          </div>
        ) : (
          <div className="metric-grid" style={{ marginTop: 0 }}>
            {lists.map((list) => {
              const totalTodos = list.todos.length;
              const completedTodos = list.todos.filter((t) => t.isCompleted).length;
              const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

              return (
                <Link
                  href={`/lists/${list.id}`}
                  key={list.id}
                  className="dashboard-card glass-panel"
                  style={{
                    minHeight: "135px",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    gap: "0.85rem",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontFamily: "var(--font-mono)",
                          fontWeight: "700",
                          padding: "0.18rem 0.5rem",
                          borderRadius: "0.35rem",
                          backgroundColor: list.project
                            ? "rgba(99, 102, 241, 0.14)"
                            : "var(--muted-bg)",
                          color: list.project ? "var(--accent)" : "var(--muted)",
                        }}
                      >
                        {list.project ? `📁 ${list.project.title}` : "📋 Standalone List"}
                      </span>
                      <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700" }}>
                        Open Tasks →
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--foreground)", marginTop: "0.15rem" }}>
                      {list.title}
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                      <span>
                        {completedTodos}/{totalTodos} Tasks Done
                      </span>
                      <span>
                        {new Date(list.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div style={{ width: "100%", height: "4px", backgroundColor: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${completionRate}%`, height: "100%", backgroundColor: "var(--accent)" }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
