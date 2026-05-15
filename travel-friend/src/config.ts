import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { DevrelConfig, Platform } from "./types.js";

const DEFAULT_CONFIG: DevrelConfig = {
  voice: "Senior Architect",
  socialHandle: "",
  defaultPlatform: "twitter",
  maxIterations: 3,
  apiKeys: {
    provider: "",
    key: "",
  },
};

export function loadConfig(path = "config.toml"): DevrelConfig {
  const target = resolve(path);
  if (!existsSync(target)) {
    return DEFAULT_CONFIG;
  }

  const parsed = parseTomlSubset(readFileSync(target, "utf8"));
  return {
    voice: stringValue(parsed.voice, DEFAULT_CONFIG.voice),
    socialHandle: stringValue(parsed.social_handle, DEFAULT_CONFIG.socialHandle),
    defaultPlatform: platformValue(parsed.default_platform, DEFAULT_CONFIG.defaultPlatform),
    maxIterations: numberValue(parsed.max_iterations, DEFAULT_CONFIG.maxIterations),
    apiKeys: {
      provider: stringValue(parsed["api_keys.provider"], DEFAULT_CONFIG.apiKeys.provider),
      key: stringValue(parsed["api_keys.key"], DEFAULT_CONFIG.apiKeys.key),
    },
  };
}

function parseTomlSubset(source: string): Record<string, string | number> {
  const values: Record<string, string | number> = {};
  let section = "";

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+#.*$/, "").trim();
    if (!line) continue;

    const sectionMatch = line.match(/^\[([A-Za-z0-9_.-]+)\]$/);
    if (sectionMatch) {
      section = sectionMatch[1] ?? "";
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.+)$/);
    if (!match) continue;

    const key = section ? `${section}.${match[1]}` : match[1];
    const value = match[2]?.trim() ?? "";
    values[key] = parseTomlValue(value);
  }

  return values;
}

function parseTomlValue(value: string): string | number {
  if (/^".*"$/.test(value)) return value.slice(1, -1);
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function platformValue(value: unknown, fallback: Platform): Platform {
  return value === "twitter" || value === "linkedin" || value === "readme" ? value : fallback;
}
