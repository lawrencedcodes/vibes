import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import type { DraftResult, Platform } from "./types.js";

export async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return "";

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export function readFiles(paths: string[]): { content: string; sourceLabel: string } {
  const parts = paths.map((path) => {
    const fullPath = resolve(path);
    return `\n\n--- FILE: ${path} ---\n\n${readFileSync(fullPath, "utf8")}`;
  });

  return {
    content: parts.join(""),
    sourceLabel: paths.length === 1 ? basename(paths[0] ?? "artifact") : `${paths.length}-files`,
  };
}

export function writeDraft(platform: Platform, result: DraftResult, outputDir = ".devrel"): string {
  mkdirSync(outputDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const path = resolve(outputDir, `${platform}-${stamp}.md`);
  const metadata = [
    "<!--",
    `RALPH iterations: ${result.iteration}`,
    `Technical Accuracy Score: ${result.audit.score}`,
    `Language: ${result.plan.language}`,
    "-->",
    "",
  ].join("\n");

  writeFileSync(path, metadata + result.markdown, "utf8");
  return path;
}
