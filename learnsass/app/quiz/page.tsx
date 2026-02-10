"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { questions } from '../../data/quiz';
import './quiz.css';

export default function QuizPage() {
    // Answers mapping: QuestionID -> Array of selected Option Indices
    const [answers, setAnswers] = useState<Record<number, number[]>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleOptionSelect = (questionId: number, optionIndex: number) => {
        if (isSubmitted) return;

        setAnswers((prev) => {
            const currentSelections = prev[questionId] || [];

            // Check if the question supports multiple answers
            const question = questions.find(q => q.id === questionId);
            // For now, even if our data uses arrays, most questions are single choice.
            // We will treat it as Multi-Select ONLY if the data explicitly has > 1 correct answer.
            // Otherwise, standard radio behavior.
            const isMultiSelect = question && question.correctAnswerIndices.length > 1;

            if (isMultiSelect) {
                const isSelected = currentSelections.includes(optionIndex);
                if (isSelected) {
                    return { ...prev, [questionId]: currentSelections.filter(i => i !== optionIndex) };
                } else {
                    return { ...prev, [questionId]: [...currentSelections, optionIndex] };
                }
            } else {
                // Single select behavior (Radio) - always replace
                return { ...prev, [questionId]: [optionIndex] };
            }
        });

        if (showError) setShowError(false);
    };

    const getUnansweredQuestions = () => {
        const unanswered = [];
        for (const q of questions) {
            const selections = answers[q.id];
            if (!selections || selections.length === 0) {
                unanswered.push(q.id);
            }
        }
        return unanswered;
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q) => {
            const userSelections = answers[q.id] || [];
            // Exact match logic:
            // Must select ALL correct answers and NO wrong answers
            if (userSelections.length === q.correctAnswerIndices.length) {
                const allCorrect = userSelections.every(val => q.correctAnswerIndices.includes(val));
                if (allCorrect) correct++;
            }
        });
        return correct;
    };

    const handleSubmit = () => {
        const unanswered = getUnansweredQuestions();
        if (unanswered.length > 0) {
            setShowError(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitted(true);
        setShowError(false);

        // Instead of scrolling to top, we might want to stay put or scroll to score? 
        // User requested score at bottom, so staying at bottom (where button is) is good.
        // We will just let the UI update.
    };

    const handleReset = () => {
        setAnswers({});
        setIsSubmitted(false);
        setShowError(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const unansweredList = getUnansweredQuestions();

    return (
        <div className="container quiz-container">
            <Link href="/modules/roadmaps-slas" className="back-link">
                <ArrowLeft size={20} /> Back to Course
            </Link>

            <div className="quiz-header">
                <h1 className="text-3xl font-bold text-primary mb-4">Final Course Quiz</h1>
                <p className="text-secondary-foreground mb-8">
                    Test your knowledge of SaaS principles. There are {questions.length} questions.
                    You must answer all of them to get your score.
                </p>
            </div>

            {showError && (
                <div className="error-banner mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
                    <AlertCircle className="flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Please answer all questions before submitting.</p>
                        <p className="text-sm mt-1">
                            You have {unansweredList.length} unanswered questions: {unansweredList.join(", ")}
                        </p>
                    </div>
                </div>
            )}

            {/* Questions List */}
            <div className="questions-list space-y-8 mb-12">
                {questions.map((q, index) => {
                    const userSelections = answers[q.id] || [];

                    // Determine status
                    const isCorrect = isSubmitted &&
                        userSelections.length === q.correctAnswerIndices.length &&
                        userSelections.every(val => q.correctAnswerIndices.includes(val));

                    const isWrong = isSubmitted && !isCorrect;

                    return (
                        <div
                            key={q.id}
                            id={`question-${q.id}`}
                            className={`question-card p-6 border rounded-lg bg-card transition-all ${showError && userSelections.length === 0 ? 'border-red-300 bg-red-50/30' : 'border-border'
                                } ${isSubmitted ? (isCorrect ? 'border-green-200 bg-green-50/20' : 'border-red-200 bg-red-50/20') : ''}`}
                        >
                            <div className="flex gap-4">
                                <span className="question-number text-sm font-mono text-muted-foreground w-6 pt-1 flex-shrink-0">
                                    {index + 1}.
                                </span>
                                <div className="w-full">
                                    <h3 className="text-lg font-medium mb-4">{q.text}</h3>
                                    <div className="options-grid space-y-3">
                                        {q.options.map((option, optIndex) => {
                                            const isSelected = userSelections.includes(optIndex);
                                            const isActualCorrect = q.correctAnswerIndices.includes(optIndex);

                                            let optionClass = "option-btn w-full text-left p-3 rounded border transition-all ";

                                            if (isSubmitted) {
                                                if (isActualCorrect) {
                                                    // Always show correct answers in green
                                                    optionClass += "bg-green-100 border-green-400 text-green-800 font-medium";
                                                } else if (isSelected && !isActualCorrect) {
                                                    // Wrong selection
                                                    optionClass += "bg-red-100 border-red-300 text-red-800";
                                                } else {
                                                    optionClass += "opacity-50 border-transparent bg-gray-50";
                                                }
                                            } else {
                                                if (isSelected) {
                                                    optionClass += "bg-primary text-white border-primary shadow-sm";
                                                } else {
                                                    optionClass += "hover:bg-gray-50 border-border bg-white text-foreground";
                                                }
                                            }

                                            return (
                                                <button
                                                    key={optIndex}
                                                    onClick={() => handleOptionSelect(q.id, optIndex)}
                                                    disabled={isSubmitted}
                                                    className={optionClass}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{option}</span>
                                                        {/* Icon logic */}
                                                        {isSubmitted && isActualCorrect && <CheckCircle size={16} className="text-green-600" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {isSubmitted && !isCorrect && (
                                        <div className="mt-4 text-sm text-red-600 flex items-center gap-2">
                                            <AlertCircle size={14} />
                                            <span>Incorrect. The right answers are highlighted in green.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Score Card - Moved to Bottom */}
            {isSubmitted && (
                <div className="score-card mb-10 p-8 bg-green-50 border border-green-200 rounded-xl text-center shadow-sm">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4 text-green-600">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-bold text-green-800 mb-2">{percentage}%</h2>
                    <p className="text-xl text-green-700 mb-6">
                        You scored {score} out of {questions.length}
                    </p>
                    <button
                        onClick={handleReset}
                        className="reset-btn inline-flex items-center gap-2 px-6 py-2 bg-white border border-green-300 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-colors"
                    >
                        <RefreshCw size={18} /> Retake Quiz
                    </button>
                </div>
            )}

            {!isSubmitted && (
                <div className="submit-section mt-12 text-center pb-20">
                    <button
                        onClick={handleSubmit}
                        className="submit-btn text-lg font-semibold bg-primary text-white px-12 py-4 rounded-full shadow-lg hover:bg-primary-hover transition-transform hover:scale-105"
                    >
                        Submit Answers
                    </button>
                </div>
            )}
        </div>
    );
}
