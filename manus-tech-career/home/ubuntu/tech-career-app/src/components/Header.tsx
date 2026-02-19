'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { GraduationCap } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span className="font-semibold text-lg">Tech Career Guidance</span>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="/assessment" className="text-sm font-medium hover:text-primary transition-colors">Explore Careers</a>
            <a href="/learning-path" className="text-sm font-medium hover:text-primary transition-colors">Learning Paths</a>
            <a href="/community" className="text-sm font-medium hover:text-primary transition-colors">Community</a>
            <a href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">Jobs</a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
