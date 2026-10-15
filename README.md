# Busymate AI for Claude

Anthropic directory listings for [Busymate AI](https://busymate.ai):

1. **MCP connector.** The hosted server at `https://busymate.ai/mcp` is submitted by URL in the developer portal at [claude.ai/directory/manage](https://claude.ai/directory/manage). The listing copy, example prompts and reviewer steps are in [`submission/`](submission/).
2. **Plugin bundle.** The folder [`plugin/`](plugin/) bundles the same server with two skills for claude.ai, Cowork and Claude Code. Submit it with plugin path `plugin`.

**Status: draft, not submitted.** The server profile does not exist yet; `node scripts/scan-live.mjs` lists what is missing. See [docs/submission-checklist.md](docs/submission-checklist.md).

## Layout

| Path | Purpose |
|---|---|
| `plugin/` | The plugin as users install it: `.claude-plugin/plugin.json`, `.mcp.json`, `skills/`, README, LICENSE |
| `.claude-plugin/marketplace.json` | Lets Claude Code install the plugin straight from this repo |
| `submission/connector-listing.md` | Connector listing copy, data-handling answers, example prompts, reviewer steps (no credentials) |
| `submission/tools.json` | The server's tools as a workspace admin sees them, with Claude's annotation rule (generated from the server) |
| `scripts/validate.mjs` | Offline checks that mirror the directory's validation |
| `scripts/scan-live.mjs` | Compares the live `tools/list` with `submission/tools.json`; fails closed |

```sh
node scripts/validate.mjs
claude plugin validate plugin && claude plugin validate .
node scripts/scan-live.mjs                          # pre-auth view
BUSYMATE_MCP_TOKEN=... node scripts/scan-live.mjs   # signed-in view
```

The repository can stay private while it is validated and reviewed, but it must be public before the plugin goes live. Keep it free of internal material for that reason.

## What is not in this repo

The MCP server, tool definitions, OAuth, the privacy policy and the reviewer workspace live in the Busymate product source. Change tools there.

Sibling: `busymate-ai-plugin-openai`. Later directories follow the same `busymate-ai-plugin-<vendor>` pattern.
