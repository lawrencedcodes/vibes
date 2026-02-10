"use client";

import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
    currentModuleIndex: number; // Keep for backward compatibility or alternate use
    totalModules: number;
    percentage?: number; // Optional override for exact percentage
}

export default function ProgressBar({ currentModuleIndex, totalModules, percentage }: ProgressBarProps) {
    // Use provided percentage OR calculate based on module index
    let progress = 0;

    if (percentage !== undefined) {
        progress = Math.min(100, Math.max(0, percentage));
    } else {
        progress = Math.min(100, Math.max(0, ((currentModuleIndex + 1) / totalModules) * 100));
    }

    return (
        <div className="progress-container">
            <div className="progress-label">
                <span>Course Progress</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
