#!/usr/bin/env node
import { loadConfig } from "./config.js";
import { transform } from "./engine.js";
import type { Platform } from "./types.js";

interface JsonRpcRequest {
  id?: string | number;
  method: string;
  params?: Record<string, unknown>;
}

process.stdin.setEncoding("utf8");

let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let index = buffer.indexOf("\n");

  while (index >= 0) {
    const line = buffer.slice(0, index).trim();
    buffer = buffer.slice(index + 1);
    if (line) void handleLine(line);
    index = buffer.indexOf("\n");
  }
});

async function handleLine(line: string): Promise<void> {
  const request = JSON.parse(line) as JsonRpcRequest;

  try {
    if (request.method === "initialize") {
      respond(request.id, {
        protocolVersion: "2024-11-05",
        serverInfo: { name: "devrel-mult", version: "0.1.0" },
        capabilities: { tools: {} },
      });
      return;
    }

    if (request.method === "tools/list") {
      respond(request.id, {
        tools: [
          {
            name: "devrel_mult.transform",
            description: "Transform a technical artifact into Twitter, LinkedIn, or README Markdown.",
            inputSchema: {
              type: "object",
              properties: {
                content: { type: "string" },
                platform: { type: "string", enum: ["twitter", "linkedin", "readme"] },
                sourceLabel: { type: "string" },
              },
              required: ["content", "platform"],
            },
          },
        ],
      });
      return;
    }

    if (request.method === "tools/call") {
      const name = String(request.params?.name ?? "");
      if (name !== "devrel_mult.transform") throw new Error(`Unknown tool: ${name}`);

      const args = (request.params?.arguments ?? {}) as Record<string, unknown>;
      const platform = parsePlatform(String(args.platform ?? "twitter"));
      const result = await transform({
        content: String(args.content ?? ""),
        platform,
        sourceLabel: String(args.sourceLabel ?? "mcp-input"),
        config: loadConfig(),
      });

      respond(request.id, {
        content: [{ type: "text", text: result.markdown }],
        structuredContent: {
          score: result.audit.score,
          iterations: result.iteration,
          plan: result.plan,
        },
      });
      return;
    }

    respond(request.id, {});
  } catch (error) {
    respondError(request.id, error instanceof Error ? error.message : String(error));
  }
}

function respond(id: JsonRpcRequest["id"], result: unknown): void {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}

function respondError(id: JsonRpcRequest["id"], message: string): void {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32000, message } })}\n`);
}

function parsePlatform(value: string): Platform {
  if (value === "twitter" || value === "linkedin" || value === "readme") return value;
  throw new Error("platform must be one of: twitter, linkedin, readme");
}
