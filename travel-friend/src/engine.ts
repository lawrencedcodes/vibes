import type { DraftResult, TransformInput } from "./types.js";
import { runRalphLoop } from "./ralph.js";

export async function transform(input: TransformInput): Promise<DraftResult> {
  const content = input.content.trim();
  if (!content) {
    throw new Error("No technical artifact content was provided.");
  }

  return runRalphLoop({
    ...input,
    content: content.slice(0, 50000),
  });
}
