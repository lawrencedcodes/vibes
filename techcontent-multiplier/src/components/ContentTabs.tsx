import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin, MessageSquare, Twitter, Mic, Video, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';

interface ContentTabsProps {
  assets: {
    linkedin: Array<{ title: string; content: string }>;
    discord: string;
    tweet: string;
    conference: { title: string; abstract: string; outline: string[] };
    videoScript: string;
  };
}

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
        copied 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
          : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700",
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}

export function ContentTabs({ assets }: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'discord' | 'tweet' | 'conference' | 'video'>('linkedin');

  const tabs = [
    { id: 'linkedin', label: 'LinkedIn Series', icon: Linkedin },
    { id: 'discord', label: 'Discord TL;DR', icon: MessageSquare },
    { id: 'tweet', label: 'Tweet', icon: Twitter },
    { id: 'conference', label: 'Conf Talk', icon: Mic },
    { id: 'video', label: 'Video Script', icon: Video },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'linkedin':
        return (
          <div className="space-y-8">
            {assets.linkedin.map((post, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-mono text-emerald-500 text-sm uppercase tracking-wider">{post.title}</h4>
                  <CopyButton text={post.content} />
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        );
      case 'discord':
        return (
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 relative">
             <div className="flex justify-end mb-2">
              <CopyButton text={assets.discord} />
            </div>
            <div className="prose prose-invert prose-sm max-w-none font-mono text-xs">
              <ReactMarkdown>{assets.discord}</ReactMarkdown>
            </div>
          </div>
        );
      case 'tweet':
        return (
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 max-w-xl mx-auto relative">
             <div className="flex justify-end mb-4">
              <CopyButton text={assets.tweet} />
            </div>
            <div className="text-lg font-medium text-zinc-200">
              {assets.tweet}
            </div>
            <div className="mt-4 text-zinc-500 text-sm font-mono">
              {assets.tweet.length} / 280 chars
            </div>
          </div>
        );
      case 'conference':
        const conferenceText = `# ${assets.conference.title}\n\n## Abstract\n${assets.conference.abstract}\n\n## Outline\n${assets.conference.outline.join('\n')}`;
        return (
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-8 relative">
             <div className="absolute top-6 right-6">
              <CopyButton text={conferenceText} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-6 pr-20">{assets.conference.title}</h2>
            <div className="mb-8">
              <h3 className="text-sm font-mono text-emerald-500 uppercase tracking-wider mb-2">Abstract</h3>
              <p className="text-zinc-300 leading-relaxed">{assets.conference.abstract}</p>
            </div>
            <div>
              <h3 className="text-sm font-mono text-emerald-500 uppercase tracking-wider mb-2">Talk Outline</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                {assets.conference.outline.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 relative">
             <div className="flex justify-end mb-2">
              <CopyButton text={assets.videoScript} />
            </div>
            <div className="prose prose-invert prose-sm max-w-none font-mono">
              <ReactMarkdown>{assets.videoScript}</ReactMarkdown>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto border-b border-zinc-800 mb-6 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
