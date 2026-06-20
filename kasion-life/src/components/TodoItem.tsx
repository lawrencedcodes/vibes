"use client";

import React, { useState, useTransition } from "react";
import { toggleTodo } from "@/app/actions/todos";
import { toggleSubtask, createSubtask } from "@/app/actions/subtasks";

interface Subtask {
  id: string;
  content: string;
  isCompleted: boolean;
  createdAt: Date;
  todoId: string;
}

interface TodoItemProps {
  id: string;
  content: string;
  isCompleted: boolean;
  listId: string;
  subtasks: Subtask[];
}

export default function TodoItem({ id, content, isCompleted, listId, subtasks }: TodoItemProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [isExpanded, setIsExpanded] = useState(false);
  const [subtaskContent, setSubtaskContent] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [isAddingSubtask, startAddTransition] = useTransition();

  const handleToggle = () => {
    const nextState = !completed;
    setCompleted(nextState);
    
    startTransition(async () => {
      try {
        await toggleTodo(id, nextState, listId);
      } catch (error) {
        setCompleted(!nextState);
        console.error("Failed to persist todo checked update:", error);
      }
    });
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskContent.trim()) return;

    const valueToSubmit = subtaskContent.trim();
    setSubtaskContent(""); // clear input instantly
    
    startAddTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("content", valueToSubmit);
        await createSubtask(id, listId, undefined, formData);
      } catch (error) {
        console.error("Failed to add subtask:", error);
      }
    });
  };

  const completedSubtasks = subtasks.filter((s) => s.isCompleted).length;
  const totalSubtasks = subtasks.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        borderRadius: "0.75rem",
        backgroundColor: "var(--muted-bg)",
        border: "1px solid var(--border)",
        opacity: isPending ? 0.6 : 1,
        transition: "opacity 0.2s ease, border-color 0.2s ease",
        padding: "0.875rem 1rem",
      }}
    >
      {/* Main Todo Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flex: 1, minWidth: 0 }}>
          <input
            type="checkbox"
            checked={completed}
            onChange={handleToggle}
            disabled={isPending}
            style={{
              accentColor: "var(--accent)",
              cursor: "pointer",
              height: "16px",
              width: "16px",
              borderRadius: "4px",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "0.875rem",
              color: completed ? "var(--muted)" : "var(--foreground)",
              textDecoration: completed ? "line-through" : "none",
              transition: "color 0.2s ease, text-decoration 0.2s ease",
              wordBreak: "break-word",
              fontWeight: "500",
            }}
          >
            {content}
          </span>
        </div>

        {/* Expand Toggler / Subtask Count Indicator */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--muted)",
            fontSize: "0.75rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.375rem",
            transition: "all 0.2s ease",
            fontFamily: "var(--font-mono)",
          }}
          className="hover-accent-bg"
        >
          {totalSubtasks > 0 && (
            <span style={{ color: completedSubtasks === totalSubtasks ? "#10b981" : "var(--accent)" }}>
              {completedSubtasks}/{totalSubtasks}
            </span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Expandable Subtask List */}
      {isExpanded && (
        <div
          style={{
            marginTop: "0.5rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
            paddingLeft: "1.75rem",
          }}
          className="animate-fade-in"
        >
          {/* Subtask items loop */}
          {subtasks.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              id={subtask.id}
              content={subtask.content}
              isCompleted={subtask.isCompleted}
              listId={listId}
            />
          ))}

          {/* Quick Inline Subtask Add Form */}
          <form onSubmit={handleAddSubtask} style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            <input
              type="text"
              placeholder="Add subtask..."
              value={subtaskContent}
              onChange={(e) => setSubtaskContent(e.target.value)}
              disabled={isAddingSubtask}
              style={{
                flex: 1,
                fontSize: "0.75rem",
                padding: "0.375rem 0.75rem",
                borderRadius: "0.5rem",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              className="subtask-input-focus"
            />
            <button
              type="submit"
              disabled={isAddingSubtask || !subtaskContent.trim()}
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0 0.75rem",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: !subtaskContent.trim() ? 0.5 : 1,
              }}
            >
              {isAddingSubtask ? "..." : "+"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Minimalist Subtask Item Component
interface SubtaskItemProps {
  id: string;
  content: string;
  isCompleted: boolean;
  listId: string;
}

function SubtaskItem({ id, content, isCompleted, listId }: SubtaskItemProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextState = !completed;
    setCompleted(nextState);
    
    startTransition(async () => {
      try {
        await toggleSubtask(id, nextState, listId);
      } catch (error) {
        setCompleted(!nextState);
        console.error("Failed to persist subtask check state:", error);
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        opacity: isPending ? 0.6 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={handleToggle}
        disabled={isPending}
        style={{
          accentColor: "var(--accent)",
          cursor: "pointer",
          height: "13px",
          width: "13px",
          borderRadius: "3px",
        }}
      />
      <span
        style={{
          fontSize: "0.8rem",
          color: completed ? "var(--muted)" : "var(--foreground)",
          textDecoration: completed ? "line-through" : "none",
          transition: "color 0.2s ease, text-decoration 0.2s ease",
          wordBreak: "break-word",
        }}
      >
        {content}
      </span>
    </div>
  );
}
