"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { saveJournalEntry } from "@/app/actions/journal";

interface JournalEditorProps {
  initialContent: string;
}

export default function JournalEditor({ initialContent }: JournalEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "typing" | "error">("saved");
  const [isPending, startSavingTransition] = useTransition();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save
  useEffect(() => {
    // Avoid saving on mount when content equals initial server content
    if (content === initialContent) return;

    setSaveStatus("typing");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      triggerSave(content);
    }, 1500); // 1.5s typing delay

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content]);

  const triggerSave = (text: string) => {
    setSaveStatus("saving");
    startSavingTransition(async () => {
      try {
        await saveJournalEntry(text);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus("error");
      }
    });
  };

  const handleManualSave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    triggerSave(content);
  };

  // Live word counter
  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      {/* Editor Status Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontWeight: "500" }}>
          Today's Reflection
        </span>
        
        {/* Visual status chimes */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            fontSize: "0.75rem",
            fontWeight: "700",
            color: saveStatus === "saved" ? "#10b981" : saveStatus === "saving" ? "var(--accent)" : saveStatus === "error" ? "#ef4444" : "var(--muted)",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
            transition: "color 0.2s ease",
            letterSpacing: "0.05em"
          }}>
            {saveStatus === "saved" && "Synced to Cloud"}
            {saveStatus === "saving" && "Saving Entry..."}
            {saveStatus === "typing" && "Typing..."}
            {saveStatus === "error" && "Save Failed"}
          </span>
          <div style={{
            height: "8px",
            width: "8px",
            borderRadius: "50%",
            backgroundColor: saveStatus === "saved" ? "#10b981" : saveStatus === "saving" ? "var(--accent)" : saveStatus === "error" ? "#ef4444" : "var(--muted)",
            animation: saveStatus === "saving" ? "pulse-animation 1.5s infinite" : "none",
            transition: "background-color 0.2s ease"
          }} />
        </div>
      </div>

      {/* Editor Container */}
      <div className="glass-panel" style={{
        padding: "1.75rem",
        borderRadius: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        backgroundColor: "var(--card-bg)"
      }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing... Clear your mind, capture your thoughts, record your milestones. Your journal entries auto-save as you type."
          disabled={isPending}
          style={{
            width: "100%",
            minHeight: "450px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--foreground)",
            fontSize: "1rem",
            lineHeight: "1.75",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
        
        {/* Bottom Info Row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid var(--border)",
          paddingTop: "1.25rem",
          marginTop: "0.5rem"
        }}>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: "600", fontFamily: "var(--font-mono)" }}>
            {getWordCount(content)} words
          </span>

          <button
            onClick={handleManualSave}
            disabled={saveStatus === "saved" || isPending}
            style={{
              backgroundColor: saveStatus === "saved" ? "var(--muted-bg)" : "var(--accent)",
              color: saveStatus === "saved" ? "var(--muted)" : "var(--accent-foreground)",
              border: saveStatus === "saved" ? "1px solid var(--border)" : "none",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.815rem",
              fontWeight: "600",
              cursor: saveStatus === "saved" ? "default" : "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {isPending ? "Saving..." : "Save Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
