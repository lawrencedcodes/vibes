import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { modules } from '../../../data/modules';
import ModuleContent from '../../../components/ModuleContent';
import ProgressBar from '../../../components/ProgressBar';

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function ModulePage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { page } = await searchParams;

    const currentModuleIndex = modules.findIndex((m) => m.id === id);
    const currentModule = modules[currentModuleIndex];

    if (!currentModule) {
        notFound();
    }

    // Pagination Logic
    const currentPage = parseInt(page || '1', 10);
    const totalPagesInModule = currentModule.pages.length;
    const currentPageIndex = currentPage - 1;

    // Validate page number
    if (currentPage < 1 || currentPage > totalPagesInModule) {
        // Could redirect to page 1, but for now let's just show 404 or clamp? 
        // Clamping is safer for user exp, but let's stick to valid check or 404
        if (currentPage !== 1) notFound();
    }

    const pageContent = currentModule.pages[currentPageIndex];

    // Calculate Global Progress
    // Total pages across all modules
    const totalGlobalPages = modules.reduce((acc, m) => acc + m.pages.length, 0);

    // Pages in previous modules
    const previousModulesPages = modules.slice(0, currentModuleIndex).reduce((acc, m) => acc + m.pages.length, 0);

    // Current global step (1-based)
    const currentGlobalStep = previousModulesPages + currentPage;

    // Pass calculated percentage directly to ProgressBar
    // We need to modify ProgressBar to accept 'percentage' or keep strictly controlled
    // Let's assume we will pass the calculated percentage to the component if we refactor it,
    // OR we keep the interface and hack it? 
    // Better: Refactor ProgressBar to take `progressPercentage` optionally, or just calculate it here and pass it.
    // Actually, the current ProgressBar takes (currentModuleIndex, totalModules). 
    // I will update ProgressBar component to take an optional `overridePercentage` or just `percentage`.
    // For now, let's calculate it here.
    const progressPercentage = (currentGlobalStep / totalGlobalPages) * 100;


    const prevModule = modules[currentModuleIndex - 1];
    const nextModule = modules[currentModuleIndex + 1];

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            {/* We need to update ProgressBar to accept percentage, or we just pass the module index as before for coarse progress. 
          Let's update ProgressBar next to accept 'percentage' prop. */}
            <ProgressBar
                currentModuleIndex={currentModuleIndex}
                totalModules={modules.length}
                // @ts-ignore - We will update the component to accept this prop 
                percentage={progressPercentage}
            />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">{currentModule.title}</h1>
                <p className="text-sm text-secondary-foreground font-medium uppercase tracking-wide">
                    Page {currentPage} of {totalPagesInModule}
                </p>
            </div>

            <ModuleContent content={pageContent.content} />

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '3rem',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '2rem'
            }}>
                {/* PREVIOUS BUTTON LOGIC */}
                {currentPage > 1 ? (
                    <Link
                        href={`/modules/${id}?page=${currentPage - 1}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary-foreground)', fontWeight: 500 }}
                    >
                        <ArrowLeft size={20} />
                        <span>Previous Page</span>
                    </Link>
                ) : prevModule ? (
                    <Link
                        // Link to the *last page* of the previous module for smooth flow?
                        // Or just the module start. Let's do module start for simplicity unless I calculate prev module length.
                        // Let's do: Link to Prev Module (Page 1)
                        href={`/modules/${prevModule.id}?page=${prevModule.pages.length}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary-foreground)', fontWeight: 500 }}
                    >
                        <ArrowLeft size={20} />
                        <span>Previous: {prevModule.title.split('.')[1]}</span>
                    </Link>
                ) : (
                    <div></div> // Spacer
                )}

                {/* NEXT BUTTON LOGIC */}
                {currentPage < totalPagesInModule ? (
                    <Link
                        href={`/modules/${id}?page=${currentPage + 1}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}
                    >
                        <span>Next Page</span>
                        <ArrowRight size={20} />
                    </Link>
                ) : nextModule ? (
                    <Link
                        href={`/modules/${nextModule.id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}
                    >
                        <span>Next: {nextModule.title.split('.')[1]}</span>
                        <ArrowRight size={20} />
                    </Link>
                ) : (
                    <Link
                        href="/quiz"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}
                    >
                        <span>Take Final Quiz</span>
                        <ArrowRight size={20} />
                    </Link>
                )}
            </div>
        </div>
    );
}
