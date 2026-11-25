"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { saveJournalEntry, deleteJournalEntry } from "@/app/actions/journal";
import { JournalIcon } from "./Icons";

export interface SerializedJournalEntry {
  id: string;
  date: string;
  content: string;
  createdAt: string;
}

interface JournalEditorProps {
  initialEntries?: SerializedJournalEntry[];
}

export default function JournalEditor({
  initialEntries = [],
}: JournalEditorProps) {
  // Determine if the latest entry was created today so we can load it or let user start fresh
  const latestEntry = initialEntries[0] || null;

  const [entries, setEntries] = useState<SerializedJournalEntry[]>(initialEntries);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(
    latestEntry ? latestEntry.id : null
  );
  const [content, setContent] = useState<string>(
    latestEntry ? latestEntry.content : ""
  );
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "typing" | "error"
  >("saved");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [expandedEntryIds, setExpandedEntryIds] = useState<string[]>(
    latestEntry ? [latestEntry.id] : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isPending, startSavingTransition] = useTransition();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>(
    latestEntry ? latestEntry.content : ""
  );
  const activeEntryIdRef = useRef<string | null>(
    latestEntry ? latestEntry.id : null
  );

  // Keep ref in sync with state so debounced callbacks always use the latest activeEntryId
  useEffect(() => {
    activeEntryIdRef.current = activeEntryId;
  }, [activeEntryId]);

  // Sync server-refreshed initialEntries while preserving local edits
  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  // Debounced auto-save
  useEffect(() => {
    if (content === lastSavedContentRef.current) return;
    if (!content.trim() && !activeEntryIdRef.current) {
      setSaveStatus("saved");
      return;
    }

    setSaveStatus("typing");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      triggerSave(content, activeEntryIdRef.current);
    }, 1200);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content]);

  const triggerSave = (
    textToSave: string,
    targetId: string | null,
    clearAfterSave = false
  ) => {
    if (!textToSave.trim() && !targetId) {
      return;
    }

    setSaveStatus("saving");
    startSavingTransition(async () => {
      try {
        const saved = await saveJournalEntry(textToSave, targetId);
        lastSavedContentRef.current = clearAfterSave ? "" : saved.content;

        setEntries((prev) => {
          const exists = prev.some((e) => e.id === saved.id);
          if (exists) {
            return prev.map((e) => (e.id === saved.id ? saved : e));
          }
          return [saved, ...prev];
        });

        setExpandedEntryIds((prev) =>
          prev.includes(saved.id) ? prev : [saved.id, ...prev]
        );

        const nowTime = new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
        setLastSavedAt(nowTime);
        setSaveStatus("saved");

        if (clearAfterSave) {
          setActiveEntryId(null);
          activeEntryIdRef.current = null;
          setContent("");
        } else {
          setActiveEntryId(saved.id);
          activeEntryIdRef.current = saved.id;
        }
      } catch (error) {
        console.error("Failed to save journal entry:", error);
        setSaveStatus("error");
      }
    });
  };

  const handleManualSave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    triggerSave(content, activeEntryIdRef.current, false);
  };

  const handleStartNewEntry = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // If current editor has unsaved non-empty text, save it first then clear
    if (content.trim() && content !== lastSavedContentRef.current) {
      triggerSave(content, activeEntryIdRef.current, true);
      return;
    }

    setActiveEntryId(null);
    activeEntryIdRef.current = null;
    lastSavedContentRef.current = "";
    setContent("");
    setSaveStatus("saved");
  };

  const handleSelectEntry = (entry: SerializedJournalEntry) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setActiveEntryId(entry.id);
    activeEntryIdRef.current = entry.id;
    lastSavedContentRef.current = entry.content;
    setContent(entry.content);
    setSaveStatus("saved");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpandEntry = (id: string) => {
    setExpandedEntryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteEntry = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteJournalEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (activeEntryIdRef.current === id) {
        setActiveEntryId(null);
        activeEntryIdRef.current = null;
        lastSavedContentRef.current = "";
        setContent("");
      }
    } catch (error) {
      console.error("Failed to delete entry:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const isSameDayAsToday = (isoDate: string) => {
    const d = new Date(isoDate);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const formatEntryDate = (isoDate: string, createdIso?: string) => {
    const d = new Date(isoDate);
    const datePart = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeSource = createdIso ? new Date(createdIso) : d;
    const timePart = timeSource.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${datePart.toUpperCase()} • ${timePart}`;
  };

  const getEntryTitleAndBody = (rawContent: string) => {
    const lines = rawContent.trim().split("\n");
    const firstLine = (lines[0] || "Untitled Entry").trim();
    const title =
      firstLine.length > 85 ? firstLine.slice(0, 85) + "…" : firstLine;
    const body = lines.slice(1).join("\n").trim();
    return { title, body, fullText: rawContent.trim() };
  };

  const visibleEntries = entries
    .filter((e) => e.content.trim().length > 0)
    .filter((e) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.content.toLowerCase().includes(q) ||
        formatEntryDate(e.date, e.createdAt).toLowerCase().includes(q)
      );
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem", inlineSize: "100%" }}>
      {/* 1. Editor Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", inlineSize: "100%" }}>
        {/* Editor Status & Mode Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "safe center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--foreground)", fontWeight: "700" }}>
              {activeEntryId ? "Editing Saved Entry" : "New Reflection Entry"}
            </span>
            {activeEntryId && (
              <span
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono)",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "999px",
                  backgroundColor: "rgba(99, 102, 241, 0.14)",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                  color: "var(--accent)",
                  fontWeight: "700",
                }}
              >
                Active Log #{activeEntryId.slice(0, 6)}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {/* Visual status chimes */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color:
                    saveStatus === "saved"
                      ? "#10b981"
                      : saveStatus === "saving"
                      ? "var(--accent)"
                      : saveStatus === "error"
                      ? "#ef4444"
                      : "var(--muted)",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-mono)",
                  transition: "color 0.2s ease",
                  letterSpacing: "0.05em",
                }}
              >
                {saveStatus === "saved" &&
                  (lastSavedAt ? `Saved at ${lastSavedAt}` : "Synced to Database")}
                {saveStatus === "saving" && "Saving Entry..."}
                {saveStatus === "typing" && "Unsaved Changes..."}
                {saveStatus === "error" && "Save Failed"}
              </span>
              <div
                style={{
                  blockSize: "8px",
                  inlineSize: "8px",
                  borderRadius: "50%",
                  backgroundColor:
                    saveStatus === "saved"
                      ? "#10b981"
                      : saveStatus === "saving"
                      ? "var(--accent)"
                      : saveStatus === "error"
                      ? "#ef4444"
                      : "var(--muted)",
                  animation:
                    saveStatus === "saving" ? "pulse-animation 1.5s infinite" : "none",
                  transition: "background-color 0.2s ease",
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleStartNewEntry}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                backgroundColor: "var(--muted-bg)",
                color: "var(--foreground)",
                fontSize: "0.775rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              + New Entry
            </button>
          </div>
        </div>

        {/* Editor Container */}
        <div
          className="glass-panel"
          style={{
            padding: "1.75rem",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            backgroundColor: "var(--card-bg)",
          }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing... Use the first line as your entry headline, then capture your thoughts, lessons, or milestones below. Auto-saves as you type."
            style={{
              inlineSize: "100%",
              minBlockSize: "320px",
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

          {/* Bottom Info & Action Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "safe center",
              flexWrap: "wrap",
              gap: "0.75rem",
              borderBlockStart: "1px solid var(--border)",
              paddingBlockStart: "1.25rem",
              marginBlockStart: "0.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  fontWeight: "600",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {getWordCount(content)} words
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                • Auto-saves after 1.2s of inactivity
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <button
                type="button"
                onClick={handleManualSave}
                disabled={!content.trim() || isPending}
                style={{
                  backgroundColor: !content.trim() ? "var(--muted-bg)" : "var(--accent)",
                  color: !content.trim() ? "var(--muted)" : "var(--accent-foreground)",
                  border: !content.trim() ? "1px solid var(--border)" : "none",
                  borderRadius: "0.6rem",
                  padding: "0.55rem 1.15rem",
                  fontSize: "0.815rem",
                  fontWeight: "700",
                  cursor: !content.trim() || isPending ? "default" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {isPending ? "Saving..." : "Save Entry"}
              </button>

              {content.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => triggerSave(content, activeEntryIdRef.current, true)}
                  disabled={isPending}
                  style={{
                    backgroundColor: "var(--muted-bg)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.6rem",
                    padding: "0.55rem 1rem",
                    fontSize: "0.815rem",
                    fontWeight: "600",
                    cursor: isPending ? "default" : "pointer",
                  }}
                >
                  Save &amp; Start New
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Saved Journal Archive Section (Includes Today's & Past Entries!) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "safe center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: "800" }}>
              Saved Journal Logs
            </h2>
            <span
              style={{
                fontSize: "0.725rem",
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                padding: "0.15rem 0.55rem",
                borderRadius: "999px",
                backgroundColor: "var(--muted-bg)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
              }}
            >
              {visibleEntries.length} {visibleEntries.length === 1 ? "Entry" : "Entries"}
            </span>
          </div>

          {entries.length > 0 && (
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved journal logs..."
              aria-label="Search saved journal logs"
              style={{
                padding: "0.5rem 0.875rem",
                borderRadius: "0.65rem",
                border: "1px solid var(--border)",
                backgroundColor: "var(--muted-bg)",
                color: "var(--foreground)",
                fontSize: "0.825rem",
                minInlineSize: "240px",
                outline: "none",
              }}
            />
          )}
        </div>

        {visibleEntries.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: "2rem",
              borderRadius: "1rem",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: "0.875rem",
            }}
          >
            {searchQuery.trim()
              ? `No journal entries match "${searchQuery}".`
              : "No saved journal entries yet. Type above and click 'Save Entry' to record your first reflection!"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {visibleEntries.map((entry) => {
              const { title, body, fullText } = getEntryTitleAndBody(entry.content);
              const isExpanded = expandedEntryIds.includes(entry.id);
              const isActiveInEditor = activeEntryId === entry.id;
              const isToday = isSameDayAsToday(entry.date);
              const words = getWordCount(entry.content);

              return (
                <div
                  key={entry.id}
                  className="glass-panel"
                  style={{
                    padding: "1.35rem 1.5rem",
                    borderRadius: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.875rem",
                    border: isActiveInEditor
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                    background: isActiveInEditor
                      ? "linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, var(--card-bg) 100%)"
                      : "var(--card-bg)",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  {/* Top Metadata & Action Row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        {isToday && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-mono)",
                              fontWeight: "800",
                              padding: "0.12rem 0.45rem",
                              borderRadius: "999px",
                              backgroundColor: "rgba(16, 185, 129, 0.14)",
                              color: "#10b981",
                              letterSpacing: "0.05em",
                            }}
                          >
                            TODAY
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--muted)",
                            fontFamily: "var(--font-mono)",
                            fontWeight: "600",
                          }}
                        >
                          {formatEntryDate(entry.date, entry.createdAt)}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--muted)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          • {words} {words === 1 ? "word" : "words"}
                        </span>
                        {isActiveInEditor && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-mono)",
                              fontWeight: "700",
                              color: "var(--accent)",
                            }}
                          >
                            • Open in Editor
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => toggleExpandEntry(entry.id)}
                        style={{
                          fontSize: "1rem",
                          fontWeight: "700",
                          color: "var(--foreground)",
                          cursor: "pointer",
                        }}
                      >
                        {title}
                      </h3>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => toggleExpandEntry(entry.id)}
                        style={{
                          padding: "0.35rem 0.7rem",
                          borderRadius: "0.5rem",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--muted-bg)",
                          color: "var(--foreground)",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        {isExpanded ? "Collapse" : "Read Full"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectEntry(entry)}
                        style={{
                          padding: "0.35rem 0.7rem",
                          borderRadius: "0.5rem",
                          border: isActiveInEditor
                            ? "1px solid var(--accent)"
                            : "1px solid var(--border)",
                          backgroundColor: isActiveInEditor
                            ? "rgba(99, 102, 241, 0.14)"
                            : "var(--muted-bg)",
                          color: isActiveInEditor ? "var(--accent)" : "var(--foreground)",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        {isActiveInEditor ? "Editing Above" : "Load in Editor"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(entry.id)}
                        disabled={deletingId === entry.id}
                        aria-label="Delete journal entry"
                        style={{
                          padding: "0.35rem 0.65rem",
                          borderRadius: "0.5rem",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          backgroundColor: "transparent",
                          color: "#ef4444",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        {deletingId === entry.id ? "…" : "Delete"}
                      </button>

                      <span style={{ color: "var(--muted)", display: "inline-flex", marginLeft: "0.2rem" }}>
                        <JournalIcon size={15} />
                      </span>
                    </div>
                  </div>

                  {/* Entry Body / Full Reference View */}
                  {isExpanded ? (
                    <div
                      style={{
                        padding: "1rem 1.15rem",
                        borderRadius: "0.75rem",
                        backgroundColor: "var(--muted-bg)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        fontSize: "0.9rem",
                        lineHeight: "1.7",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {fullText}
                    </div>
                  ) : (
                    body && (
                      <p
                        onClick={() => toggleExpandEntry(entry.id)}
                        style={{
                          color: "var(--muted)",
                          fontSize: "0.85rem",
                          lineHeight: "1.55",
                          cursor: "pointer",
                        }}
                      >
                        {body.length > 180 ? body.slice(0, 180) + "…" : body}
                      </p>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
