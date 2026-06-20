"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  TrackerIcon,
  JournalIcon,
  GoalsIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
} from "./Icons";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const pathname = usePathname();

  // Initialize theme from localStorage or system preferences
  useEffect(() => {
    const storedTheme = localStorage.getItem("kasion-theme") as "dark" | "light" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  const toggleTheme = (targetTheme: "dark" | "light") => {
    setTheme(targetTheme);
    localStorage.setItem("kasion-theme", targetTheme);
    document.documentElement.setAttribute("data-theme", targetTheme);
  };

  const navItems = [
    { name: "Overview", path: "/", icon: DashboardIcon },
    { name: "Tracker", path: "/tracker", icon: TrackerIcon },
    { name: "Journal", path: "/journal", icon: JournalIcon },
    { name: "Goals", path: "/goals", icon: GoalsIcon },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  // Helper to format date elegantly
  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="layout-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand / Logo Header */}
        <div className="sidebar-header">
          <Link href="/" className="nav-item" style={{ padding: 0, gap: "0.75rem", background: "transparent" }}>
            <div className="logo-container">
              <span style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#ffffff", letterSpacing: "0.05em" }}>K</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="logo-text-large">
                KASION LIFE
              </span>
              <span className="logo-text-sub">
                Life Dashboard
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="close-btn"
            aria-label="Close menu"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="sidebar-content">
          <div className="nav-section-title">
            Navigation
          </div>
          <nav className="nav-list">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon
                    style={{
                      transition: "transform 0.2s ease",
                      color: isActive ? "var(--accent)" : "var(--muted)",
                    }}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Minimalist Sidebar Modules Indicator */}
          <div className="sidebar-footer-divider" style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--sidebar-border)" }}>
            <div className="nav-section-title" style={{ marginBottom: "0.75rem" }}>
              Active Modules
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button className="add-widget-dashed">
                <span>Add Widget...</span>
                <span className="badge-plus">+</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Theme Switcher */}
        <div className="sidebar-footer">
          <div className="theme-selector">
            <button
              onClick={() => toggleTheme("light")}
              className={`theme-btn ${theme === "light" ? "active" : ""}`}
            >
              <SunIcon size={14} />
              <span>Light</span>
            </button>
            <button
              onClick={() => toggleTheme("dark")}
              className={`theme-btn ${theme === "dark" ? "active" : ""}`}
            >
              <MoonIcon size={14} />
              <span>Dark</span>
            </button>
          </div>
          
          <div className="status-indicator">
            <div className="status-dot pulse" />
            <span className="status-text">v1.0.0-beta • Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Layout Container */}
      <div className="main-layout">
        {/* Top Header */}
        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="menu-btn"
              aria-label="Open menu"
            >
              <MenuIcon size={18} />
            </button>
            
            <div className="header-status">
              <span className="header-status-title">
                System Status
              </span>
              <span className="header-status-value">
                Ready for Deployment
              </span>
            </div>
          </div>

          <div className="header-right">
            {/* System Date Indicator */}
            <div className="date-badge">
              <span className="date-dot" />
              <span>{getFormattedDate()}</span>
            </div>

            {/* Profile Dropdown Placeholder */}
            <div className="profile-avatar">
              KL
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="viewport">
          <div className="viewport-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
