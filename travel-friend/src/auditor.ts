import type { AuditResult, ContentPlan, Platform } from "./types.js";

const HYPE_WORDS = /\b(revolutionary|game-changing|magical|insane|10x|never before|effortless)\b/i;

export function auditDraft(markdown: string, plan: ContentPlan, platform: Platform): AuditResult {
  const checklist: Record<string, boolean> = {
    hasSourceGrounding: hasAny(markdown, plan.technicalFacts) || plan.technicalFacts.length === 0,
    hasSeniorArchitectTone: !HYPE_WORDS.test(markdown) && /\b(tradeoff|constraint|contract|technical|source|workflow|repeatable|accuracy|checklist)\b/i.test(markdown),
    hasPlatformShape: platformShape(markdown, platform),
    avoidsInventedMetrics: !/\b\d+x\b|\b\d+%\b|\bbenchmark\b/i.test(markdown),
    hasCTAOrUsage: platform === "readme" ? /## Usage/i.test(markdown) : /\bCTA\b|compare notes|building similar/i.test(markdown),
    hasTechnicalIntegrity: /source facts|commands|module|artifact|technical/i.test(markdown),
  };

  const passedItems = Object.values(checklist).filter(Boolean).length;
  const score = Number((passedItems / Object.keys(checklist).length).toFixed(2));
  const feedback = Object.entries(checklist)
    .filter(([, passed]) => !passed)
    .map(([name]) => feedbackFor(name, platform));

  return {
    score,
    passed: score > 0.9,
    feedback,
    checklist,
  };
}

function hasAny(markdown: string, facts: string[]): boolean {
  return facts.some((fact) => {
    const words = fact.toLowerCase().split(/\W+/).filter((word) => word.length > 4);
    return words.some((word) => markdown.toLowerCase().includes(word));
  });
}

function platformShape(markdown: string, platform: Platform): boolean {
  if (platform === "twitter") return /^1\/ Hook:/m.test(markdown) && /^5\//m.test(markdown) && /^7\/ CTA:/m.test(markdown);
  if (platform === "linkedin") return /Problem:/i.test(markdown) && /Solution:/i.test(markdown) && /Insight:/i.test(markdown);
  return /## Overview/i.test(markdown) && /## Installation/i.test(markdown) && /## Usage/i.test(markdown);
}

function feedbackFor(name: string, platform: Platform): string {
  const messages: Record<string, string> = {
    hasSourceGrounding: "Anchor at least one claim in a concrete source fact from the input.",
    hasSeniorArchitectTone: "Remove hype and add sober technical language about constraints or tradeoffs.",
    hasPlatformShape: `Match the required ${platform} template structure exactly.`,
    avoidsInventedMetrics: "Remove unsupported metrics, benchmarks, or percentage improvements.",
    hasCTAOrUsage: platform === "readme" ? "Include a Usage section." : "End with a clear CTA.",
    hasTechnicalIntegrity: "Name the technical integrity contract directly.",
  };
  return messages[name] ?? "Tighten the draft against the technical integrity checklist.";
}
