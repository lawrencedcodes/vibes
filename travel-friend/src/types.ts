export type Platform = "twitter" | "linkedin" | "readme";

export interface DevrelConfig {
  voice: string;
  socialHandle: string;
  defaultPlatform: Platform;
  maxIterations: number;
  apiKeys: {
    provider: string;
    key: string;
  };
}

export interface TransformInput {
  content: string;
  platform: Platform;
  sourceLabel: string;
  config: DevrelConfig;
}

export interface ContentPlan {
  sourceLabel: string;
  platform: Platform;
  audience: string;
  valueProps: string[];
  painPoints: string[];
  technicalFacts: string[];
  language: string;
  complexity: number;
  soul: string;
  improvements: string[];
  constraints: string[];
}

export interface DraftResult {
  markdown: string;
  plan: ContentPlan;
  iteration: number;
  audit: AuditResult;
}

export interface AuditResult {
  score: number;
  passed: boolean;
  feedback: string[];
  checklist: Record<string, boolean>;
}
