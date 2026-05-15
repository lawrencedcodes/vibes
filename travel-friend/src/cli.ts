#!/usr/bin/env node
import { Command, InvalidArgumentError } from "commander";
import { loadConfig } from "./config.js";
import { transform } from "./engine.js";
import { readFiles, readStdin, writeDraft } from "./io.js";
import type { Platform } from "./types.js";

const platforms: Platform[] = ["twitter", "linkedin", "readme"];

const program = new Command()
  .name("devrel-mult")
  .description("Transform technical artifacts into high-signal DevRel content.")
  .argument("[files...]", "technical files to transform")
  .option("-p, --platform <platform>", "target platform: twitter, linkedin, readme", parsePlatform)
  .option("--all", "generate all supported platforms")
  .option("-c, --config <path>", "path to config.toml", "config.toml")
  .option("-o, --output-dir <dir>", "output directory", ".devrel")
  .option("--dry-run", "print Markdown instead of writing files")
  .showHelpAfterError()
  .parse();

const options = program.opts<{
  platform?: Platform;
  all?: boolean;
  config: string;
  outputDir: string;
  dryRun?: boolean;
}>();

const files = program.args;
const config = loadConfig(options.config);
const stdin = await readStdin();
const fileInput = files.length > 0 ? readFiles(files) : { content: "", sourceLabel: "stdin" };
const content = [stdin, fileInput.content].filter(Boolean).join("\n\n");
const sourceLabel = files.length > 0 ? fileInput.sourceLabel : "stdin";
const targets = options.all ? platforms : [options.platform ?? config.defaultPlatform];

for (const platform of targets) {
  const result = await transform({ content, platform, sourceLabel, config });

  if (options.dryRun) {
    process.stdout.write(result.markdown);
    continue;
  }

  const path = writeDraft(platform, result, options.outputDir);
  process.stdout.write(`${platform}: wrote ${path} (score ${result.audit.score}, iterations ${result.iteration})\n`);
}

function parsePlatform(value: string): Platform {
  if (value === "twitter" || value === "linkedin" || value === "readme") return value;
  throw new InvalidArgumentError("platform must be one of: twitter, linkedin, readme");
}
