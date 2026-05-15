import type { ContentPlan, Platform } from "./types.js";

const IMPROVEMENTS = [
  "Boilerplate Reduction",
  "Performance Gains",
  "Type Safety",
  "Developer Experience",
  "Scalability",
  "Security",
  "Maintainability",
  "Cost Efficiency",
  "Observability",
];

const LANGUAGE_HINTS: Array<[string, RegExp]> = [
  ["TypeScript", /\b(interface|type|tsx|tsconfig|commander|node:fs)\b/i],
  ["JavaScript", /\b(function|const|let|npm|package\.json)\b/i],
  ["Java", /\b(class|Spring Boot|public static void|pom\.xml|maven)\b/i],
  ["Python", /\b(def |import |requirements\.txt|pyproject\.toml|pytest)\b/i],
  ["Rust", /\b(Cargo\.toml|fn main|impl |trait )\b/i],
  ["Go", /\b(go\.mod|func main|package main)\b/i],
];

export function createContentPlan(content: string, platform: Platform, sourceLabel: string): ContentPlan {
  const language = detectLanguage(content);
  const facts = extractTechnicalFacts(content);
  const improvements = inferImprovements(content);
  const painPoints = inferPainPoints(content);
  const valueProps = inferValueProps(content, improvements);
  const complexity = scoreComplexity(content, facts);

  return {
    sourceLabel,
    platform,
    audience: "senior engineers, engineering leaders, and DevRel practitioners",
    valueProps,
    painPoints,
    technicalFacts: facts,
    language,
    complexity,
    soul: inferSoul(content, language, improvements),
    improvements,
    constraints: [
      "Do not invent benchmarks, APIs, or commands that are not present in the source.",
      "Use a concise Senior Architect voice.",
      "Prefer technical tradeoffs over hype.",
    ],
  };
}

function detectLanguage(content: string): string {
  for (const [language, pattern] of LANGUAGE_HINTS) {
    if (pattern.test(content)) return language;
  }
  return "General";
}

function extractTechnicalFacts(content: string): string[] {
  const facts = new Set<string>();
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    if (/^(#{1,3}\s+|[-*]\s+|\d+\.\s+)/.test(line) && line.length < 160) {
      facts.add(cleanFact(line));
    }
    if (/\b(npm|pnpm|yarn|node|git|cargo|mvn|gradle|pip|docker)\b/.test(line) && line.length < 160) {
      facts.add(cleanFact(line));
    }
    if (/\b(src\/|README|package\.json|config\.toml|\.devrel|MCP|CLI|API|SDK)\b/i.test(line) && line.length < 160) {
      facts.add(cleanFact(line));
    }
    if (facts.size >= 8) break;
  }

  if (facts.size === 0) {
    const firstSentence = content.split(/[.!?]\s/).find((sentence) => sentence.trim().length > 20);
    if (firstSentence) facts.add(firstSentence.trim().slice(0, 150));
  }

  return [...facts].slice(0, 8);
}

function cleanFact(line: string): string {
  return line.replace(/^#{1,6}\s+/, "").replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "").trim();
}

function inferImprovements(content: string): string[] {
  const matches = IMPROVEMENTS.filter((item) => {
    const words = item.toLowerCase().split(/\s+/);
    return words.some((word) => content.toLowerCase().includes(word));
  });

  if (/type|interface|schema|contract/i.test(content)) matches.push("Type Safety");
  if (/test|lint|verify|audit|check/i.test(content)) matches.push("Maintainability");
  if (/cli|command|stdin|pipe|workflow|automation/i.test(content)) matches.push("Developer Experience");

  return [...new Set(matches)].slice(0, 5);
}

function inferPainPoints(content: string): string[] {
  const points = [
    "Useful technical work often ships without a clear distribution narrative.",
    "Raw implementation details need compression before they work on social channels.",
    "Content drafts can drift into hype unless they are checked against source facts.",
  ];

  if (/migration|refactor|legacy/i.test(content)) {
    points[0] = "Refactors are easy to under-explain because the value is spread across many small changes.";
  }
  if (/security|auth|token|api key/i.test(content)) {
    points[1] = "Security-sensitive implementation details need careful wording and no invented guarantees.";
  }

  return points;
}

function inferValueProps(content: string, improvements: string[]): string[] {
  const primary = improvements[0] ?? "Developer Experience";
  return [
    `Turns source-level detail into ${primary.toLowerCase()} narrative without losing technical accuracy.`,
    "Separates the content plan from the final draft, making the reasoning inspectable.",
    "Uses an audit loop so the final Markdown is constrained by the artifact instead of vibes.",
  ];
}

function scoreComplexity(content: string, facts: string[]): number {
  const signals = [
    content.length > 5000,
    content.length > 15000,
    /\b(orchestrator|distributed|agent|MCP|auth|database|queue|stream)\b/i.test(content),
    facts.length > 5,
    /```/.test(content),
  ];
  return Math.min(10, 3 + signals.filter(Boolean).length);
}

function inferSoul(content: string, language: string, improvements: string[]): string {
  if (/agent|orchestrator|loop|MCP|autonomous/i.test(content)) {
    return "The interesting part is the control loop: it turns generation into a governed workflow with explicit checks.";
  }
  if (/cli|stdin|pipe|commander/i.test(content)) {
    return "The interesting part is the boring interface discipline: composable stdin, files, and repeatable Markdown output.";
  }
  return `The interesting part is how the ${language} artifact packages ${improvements[0] ?? "implementation detail"} into something reusable.`;
}
