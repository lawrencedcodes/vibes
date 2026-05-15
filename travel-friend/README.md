# devrel-mult

`devrel-mult` is a Node.js TypeScript CLI skill that turns technical artifacts into high-signal DevRel content for Twitter/X threads, LinkedIn posts, and READMEs.

It refactors the original TechContent Multiplier idea from a prompt-driven web app into a modular CLI:

- **Ingress:** stateless input-to-template transformation engine.
- **Harness:** `commander.js` CLI with stdin and file path support.
- **RALPH loop:** Reason, Act, Loop, Progress, Halt orchestration with an internal technical integrity auditor.
- **MCP adapter:** stdio JSON-RPC server exposing the transform operation to other agents.

## Install

```bash
npm install
npm run build
npm link
```

## Usage

Pipe content:

```bash
cat README.md | devrel-mult --platform twitter
```

Use files:

```bash
devrel-mult ./src/index.ts ./README.md --platform linkedin
```

Generate every format:

```bash
devrel-mult ./docs/spec.md --all
```

Outputs are written to `.devrel/` as Markdown files.

## Configuration

Preferences live in `config.toml`.

```toml
voice = "Senior Architect"
social_handle = "@yourhandle"
default_platform = "twitter"
max_iterations = 3

[api_keys]
provider = ""
key = ""
```

The current implementation is deterministic and local-first. API key fields are reserved for future model-provider integrations.

## MCP

Run the stdio MCP-compatible adapter:

```bash
devrel-mult-mcp
```

It exposes `tools/list` and `tools/call` for `devrel_mult.transform`.
