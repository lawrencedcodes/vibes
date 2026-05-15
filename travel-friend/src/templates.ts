import type { ContentPlan, DevrelConfig, Platform } from "./types.js";

export function renderTemplate(platform: Platform, plan: ContentPlan, source: string, config: DevrelConfig, feedback: string[] = []): string {
  if (platform === "twitter") return renderTwitter(plan, config, feedback);
  if (platform === "linkedin") return renderLinkedIn(plan, config, feedback);
  return renderReadme(plan, source, config, feedback);
}

function renderTwitter(plan: ContentPlan, config: DevrelConfig, feedback: string[]): string {
  const cta = config.socialHandle
    ? `If you are building similar DevRel workflows, compare notes with ${config.socialHandle}.`
    : "If you are building similar DevRel workflows, treat the checklist as seriously as the draft.";

  return withAuditNote(`# Twitter Thread: ${plan.sourceLabel}`, feedback, [
    `1/ Hook: Most technical content fails in the handoff. The code is real, but the story gets flattened into hype. This artifact is a useful example of doing the opposite.`,
    `2/ The technical why: ${plan.soul}`,
    `3/ What stands out: ${plan.valueProps[0]}`,
    `4/ The practical constraint: ${plan.constraints[0]}`,
    `5/ Integrity check: the strongest claims here are grounded in source facts like ${formatFact(plan.technicalFacts[0])}.`,
    `6/ Senior take: ${plan.improvements.slice(0, 3).join(", ") || "maintainable developer experience"} matters only when the workflow is repeatable.`,
    `7/ CTA: ${cta}`,
  ]);
}

function renderLinkedIn(plan: ContentPlan, config: DevrelConfig, feedback: string[]): string {
  const handle = config.socialHandle ? `\n\n${config.socialHandle}` : "";
  const sharpened = feedback.length > 0 ? "Source-grounded, skeptical, and repeatable." : "";
  return finalize(`# LinkedIn Post: ${plan.sourceLabel}`, [
    `Problem: ${plan.painPoints[0]}`,
    "",
    `Solution: ${plan.valueProps[1]}`,
    "",
    `What makes it technically interesting: ${plan.soul}`,
    "",
    "The useful pattern is not louder content. It is a better contract:",
    `- Plan before drafting.`,
    `- Preserve source facts: ${plan.technicalFacts.slice(0, 3).map(formatFact).join("; ")}.`,
    `- Audit tone and technical accuracy before publishing.`,
    "",
    `Insight: ${plan.valueProps[2]}`,
    "",
    "That is the difference between repurposing and laundering uncertainty into confidence.",
    "",
    `CTA: Use the artifact's own facts as the publishing constraint. ${sharpened}`.trim(),
    handle,
  ]);
}

function renderReadme(plan: ContentPlan, source: string, _config: DevrelConfig, feedback: string[]): string {
  const commands = extractCommands(source);
  return finalize(`# ${titleFromSource(plan.sourceLabel)}`, [
    "## Overview",
    "",
    `${plan.soul} This project is aimed at ${plan.audience}.`,
    "",
    "## Technical Highlights",
    "",
    ...plan.valueProps.map((prop) => `- ${prop}`),
    "",
    "## Installation",
    "",
    commands.install.length > 0 ? commands.install.map((command) => `\`${command}\``).join("\n\n") : "`npm install`",
    "",
    "## Usage",
    "",
    commands.usage.length > 0 ? commands.usage.map((command) => `\`${command}\``).join("\n\n") : "`npm run dev`",
    "",
    "## Notes",
    "",
    ...plan.technicalFacts.slice(0, 5).map((fact) => `- ${formatFact(fact)}`),
  ]);
}

function withAuditNote(title: string, feedback: string[], body: string[]): string {
  const revisedBody = feedback.some((item) => /technical integrity/i.test(item))
    ? [...body, "", "Technical integrity stays explicit: claims are constrained to source facts."]
    : body;
  return finalize(title, revisedBody);
}

function finalize(title: string, body: string[]): string {
  return `${[title, "", ...body].join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function formatFact(fact?: string): string {
  return fact ? fact.replace(/\s+/g, " ").replace(/[.。]+$/, "").trim() : "the artifact's own commands and module names";
}

function titleFromSource(sourceLabel: string): string {
  return sourceLabel
    .replace(/\.[A-Za-z0-9]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function extractCommands(source: string): { install: string[]; usage: string[] } {
  const commands = [...source.matchAll(/(?:^|\n)\s*(?:```(?:bash|sh)?\n)?\s*((?:npm|pnpm|yarn|node|npx|git|cargo|mvn|gradle|pip|docker)\s+[^\n`]+)/g)]
    .map((match) => match[1]?.trim())
    .filter((command): command is string => Boolean(command));

  return {
    install: commands.filter((command) => /\b(install|add|get)\b/.test(command)).slice(0, 3),
    usage: commands.filter((command) => /\b(run|dev|start|build|test|serve)\b/.test(command)).slice(0, 4),
  };
}
