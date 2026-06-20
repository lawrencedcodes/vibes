import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import ProjectForm from "@/components/ProjectForm";
import Link from "next/link";

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Fetch projects with their linked lists count
  const projects = await db.project.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: {
      lists: true,
    },
  });

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Projects
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Organize your tasks and tracking lists into high-level project workspaces.
        </p>
      </div>

      {/* Project Form Container */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "1.25rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "1rem" }}>Create New Project</h2>
        <ProjectForm />
      </div>

      {/* Projects Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Active Projects</h2>
        
        {projects.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem 2rem", borderRadius: "1.25rem", borderStyle: "dashed", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              No projects created yet. Use the form above to establish your first project workspace.
            </p>
          </div>
        ) : (
          <div className="metric-grid" style={{ marginTop: 0 }}>
            {projects.map((project) => (
              <Link 
                href={`/projects/${project.id}`} 
                key={project.id}
                className="dashboard-card glass-panel" 
                style={{ minHeight: "130px", justifyContent: "space-between", textDecoration: "none" }}
              >
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "700", color: "var(--foreground)" }}>
                    {project.title}
                  </h3>
                  {project.description && (
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {project.description}
                    </p>
                  )}
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--muted)", marginTop: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "600" }}>
                    {project.lists.length} {project.lists.length === 1 ? "List" : "Lists"}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
