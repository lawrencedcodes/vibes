import React from "react";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import ProjectListForm from "@/components/ProjectListForm";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { id: projectId } = await params;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Fetch project details and its linked lists
  const project = await db.project.findUnique({
    where: { id: projectId, userId: session.userId },
    include: {
      lists: {
        orderBy: { createdAt: "desc" },
        include: {
          todos: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Navigation Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Link 
          href="/projects" 
          style={{ 
            fontSize: "0.75rem", 
            color: "var(--accent)", 
            fontWeight: "600", 
            textTransform: "uppercase", 
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}
        >
          ← Back to Projects
        </Link>
        
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
            {project.title}
          </h1>
          {project.description && (
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginTop: "0.25rem", lineHeight: "1.5" }}>
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* List Creation Form Container */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "1.25rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "1rem" }}>Add List to Project</h2>
        <ProjectListForm projectId={project.id} />
      </div>

      {/* Lists Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Project Lists</h2>
        
        {project.lists.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem 2rem", borderRadius: "1.25rem", borderStyle: "dashed", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              No lists linked to this project workspace yet. Use the form above to add a list.
            </p>
          </div>
        ) : (
          <div className="metric-grid" style={{ marginTop: 0 }}>
            {project.lists.map((list) => {
              const totalTodos = list.todos.length;
              const completedTodos = list.todos.filter((t) => t.isCompleted).length;
              const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

              return (
                <Link 
                  href={`/lists/${list.id}`} 
                  key={list.id}
                  className="dashboard-card glass-panel" 
                  style={{ minHeight: "120px", justifyContent: "space-between", textDecoration: "none" }}
                >
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--foreground)" }}>
                      {list.title}
                    </h3>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem", fontFamily: "var(--font-mono)" }}>
                      <span>
                        {completedTodos}/{totalTodos} Tasks
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginTop: "1rem" }}>
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
