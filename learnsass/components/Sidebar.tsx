"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, CheckCircle, Circle } from 'lucide-react';
import { modules } from '../data/modules';
import './Sidebar.css';

export default function Sidebar() {
    const pathname = usePathname();

    // Helper to determine if a module is active
    const isActive = (id: string) => pathname === `/modules/${id}`;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <BookOpen size={24} color="var(--color-primary)" />
                    <span className="font-bold text-lg">SaaS Principles</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {modules.map((module) => {
                        const active = isActive(module.id);
                        return (
                            <li key={module.id}>
                                <Link
                                    href={`/modules/${module.id}`}
                                    className={`sidebar-link ${active ? 'active' : ''}`}
                                >
                                    <span className="icon">
                                        {active ? <CheckCircle size={16} /> : <Circle size={16} />}
                                    </span>
                                    <span className="title">{module.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                    <li>
                        <Link
                            href="/quiz"
                            className={`sidebar-link ${pathname === '/quiz' ? 'active' : ''}`}
                        >
                            <span className="icon">
                                {pathname === '/quiz' ? <CheckCircle size={16} /> : <Circle size={16} />}
                            </span>
                            <span className="title font-bold">Final Quiz</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <p className="text-xs text-secondary-foreground">
                    © {new Date().getFullYear()} SaaS Learning
                </p>
            </div>
        </aside>
    );
}
