# devrel-mult

Use this skill when you need to transform code, PR notes, README content, or technical documentation into DevRel-ready Markdown.

## Inputs

- Raw technical text via stdin.
- One or more file paths.
- Platform target: `twitter`, `linkedin`, `readme`, or `all`.

## CLI

```bash
cat File.java | devrel-mult --platform twitter
devrel-mult README.md --platform linkedin
devrel-mult docs/spec.md --all
```

## Output

The tool writes Markdown files to `.devrel/`.

## MCP

Start the MCP-compatible server:

```bash
devrel-mult-mcp
```

Call tool `devrel_mult.transform` with:

```json
{
  "content": "technical artifact text",
  "platform": "twitter",
  "sourceLabel": "README.md"
}
```
