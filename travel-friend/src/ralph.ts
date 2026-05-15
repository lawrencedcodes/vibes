import { createContentPlan } from "./analysis.js";
import { auditDraft } from "./auditor.js";
import { renderTemplate } from "./templates.js";
import type { DraftResult, TransformInput } from "./types.js";

export async function runRalphLoop(input: TransformInput): Promise<DraftResult> {
  const plan = createContentPlan(input.content, input.platform, input.sourceLabel);
  let feedback: string[] = [];
  let markdown = "";
  let audit = auditDraft("", plan, input.platform);
  const maxIterations = Math.max(1, input.config.maxIterations);

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    markdown = renderTemplate(input.platform, plan, input.content, input.config, feedback);
    audit = auditDraft(markdown, plan, input.platform);

    if (audit.passed) {
      return { markdown, plan, iteration, audit };
    }

    feedback = audit.feedback;
  }

  throw new Error(`RALPH halted without contract approval. Score: ${audit.score}. Feedback: ${audit.feedback.join(" ")}`);
}
