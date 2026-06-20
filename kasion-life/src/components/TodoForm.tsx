"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { createTodo } from "@/app/actions/todos";

interface TodoFormProps {
  listId: string;
}

export default function TodoForm({ listId }: TodoFormProps) {
  // Bind listId to the server action so it gets passed as the first parameter
  const createTodoWithListId = createTodo.bind(null, listId);
  const [state, formAction, isPending] = useActionState(createTodoWithListId, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form inputs upon successful submission
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "480px" }}>
      {state?.error && (
        <div className="error-banner animate-fade-in" style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <span>{state.error}</span>
        </div>
      )}
      
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <input
          name="content"
          placeholder="Enter task detail..."
          required
          disabled={isPending}
          className="login-input"
          style={{ padding: "0.625rem 1rem", borderRadius: "0.75rem" }}
        />
        <button
          type="submit"
          disabled={isPending}
          className="login-btn"
          style={{ width: "auto", padding: "0 1.25rem", borderRadius: "0.75rem", whiteSpace: "nowrap", fontSize: "0.825rem" }}
        >
          {isPending ? "Adding..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}
