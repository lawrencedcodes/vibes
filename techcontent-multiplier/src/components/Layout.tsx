import React from 'react';
import { Terminal } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <Terminal className="w-5 h-5" />
            <span className="font-mono font-bold tracking-tight">TechContent_Multiplier</span>
          </div>
          <div className="text-xs font-mono text-zinc-500">v1.0.0-beta</div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-zinc-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-600 text-sm font-mono">
          Generated content requires human review. Built with Gemini 2.5 Flash.
        </div>
      </footer>
    </div>
  );
}
