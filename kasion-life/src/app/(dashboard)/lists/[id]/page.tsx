import React from "react";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import TodoForm from "@/components/TodoForm";
import TodoItem from "@/components/TodoItem";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListDetailsPage({ params }: PageProps) {
  const { id: listId } = await params;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Fetch specific list and ensure it belongs to the logged-in user
  const list = await db.list.findUnique({
    where: { id: listId, userId: session.userId },
    include: {
      project: {
        select: {
          id: true,
          title: true,
        },
      },
      todos: {
        orderBy: { createdAt: "asc" },
        include: {
          subtasks: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!list) {
    notFound();
  }

  // Task statistics
  const totalTodos = list.todos.length;
  const completedTodos = list.todos.filter((t) => t.isCompleted).length;
  const activeTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href="/lists"
            style={{
              fontSize: "0.75rem",
              color: "var(--accent)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              textDecoration: "none",
            }}
          >
            ← All Lists
          </Link>
          {list.project && (
            <>
              <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>•</span>
              <Link
                href={`/projects/${list.project.id}`}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  textDecoration: "none",
                }}
              >
                📁 Project: {list.project.title}
              </Link>
            </>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
              {list.title}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.15rem" }}>
              {activeTodos > 0
                ? `${activeTodos} active task${activeTodos === 1 ? " is" : "s are"} synced with your Focus Space Pomodoro selector.`
                : "Add tasks below—any incomplete task automatically appears in Focus Space."}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
              <span style={{ fontSize: "0.815rem", fontWeight: "600", fontFamily: "var(--font-mono)" }}>
                {completedTodos}/{totalTodos} Tasks Completed
              </span>
              <div style={{ width: "150px", height: "6px", backgroundColor: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${completionRate}%`, height: "100%", backgroundColor: "var(--accent)", transition: "width 0.3s ease" }} />
              </div>
            </div>

            <Link
              href="/focus"
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "0.75rem",
                backgroundColor: "var(--accent)",
                color: "#ffffff",
                fontSize: "0.78rem",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              ⏱️ Focus on These Tasks →
            </Link>
          </div>
        </div>
      </div>

      {/* Task Creation Container */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "1.25rem" }}>
        <TodoForm listId={list.id} />
      </div>

      {/* Task List Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Task List</h2>

        {list.todos.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem 2rem", borderRadius: "1.25rem", borderStyle: "dashed", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              No tasks added to this list yet. Enter a task title above to add one and make it available in Focus Space.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {list.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                content={todo.content}
                isCompleted={todo.isCompleted}
                listId={list.id}
                subtasks={todo.subtasks || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
