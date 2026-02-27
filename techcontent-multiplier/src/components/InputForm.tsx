import React, { useState } from 'react';
import { Link, FileText, Code, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface InputFormProps {
  onAnalyze: (content: string, type: 'url' | 'text') => void;
  isLoading: boolean;
}

export function InputForm({ onAnalyze, isLoading }: InputFormProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'url') {
      if (!url) {
        setError('Please enter a valid URL');
        return;
      }
      try {
        // Fetch URL content via our proxy
        const res = await fetch('/api/fetch-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch URL');
        }
        
        const data = await res.json();
        onAnalyze(data.content, 'url');
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      if (!text.trim()) {
        setError('Please enter some text or code');
        return;
      }
      onAnalyze(text, 'text');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex space-x-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 mb-6 w-fit mx-auto">
        <button
          onClick={() => setActiveTab('url')}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === 'url' ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          <Link size={16} />
          URL Import
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === 'text' ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          <FileText size={16} />
          Raw Text / Code
        </button>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 shadow-xl backdrop-blur-sm"
      >
        {activeTab === 'url' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-400">
              Paste a GitHub README, Blog Post, or Documentation URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/username/repo/blob/main/README.md"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-400">
              Paste your draft, code snippet, or technical notes
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="# My Awesome Project..."
              rows={8}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono text-sm resize-none"
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab('text');
              setText(`# FastGraph: High-Performance Graph Database

FastGraph is a lightweight, in-memory graph database optimized for real-time traversal.

## Features
- **Zero-Copy Traversal**: traverse millions of nodes per second.
- **Cypher-like Query Language**: familiar syntax for developers.
- **Rust Core**: built for speed and safety.

## Getting Started
\`\`\`bash
npm install fastgraph
\`\`\`

## Why FastGraph?
Traditional graph databases are too heavy for edge devices. FastGraph brings graph power to the edge with a <5MB footprint.`);
            }}
            className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors font-mono underline underline-offset-4"
          >
            Load Example Artifact
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Analyzing Artifact...
              </>
            ) : (
              <>
                <Code size={18} />
                Generate Distribution Kit
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
