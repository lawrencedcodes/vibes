"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ModuleContent.css'; // We'll create a specific CSS file for markdown styles

interface ModuleContentProps {
    content: string;
}

export default function ModuleContent({ content }: ModuleContentProps) {
    return (
        <article className="module-content">
            <ReactMarkdown
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 text-primary" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-6 mb-3" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 pl-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 pl-4" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-gray-600 dark:text-gray-400" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto mb-6">
                            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700" {...props} />
                        </div>
                    ),
                    th: ({ node, ...props }) => (
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
