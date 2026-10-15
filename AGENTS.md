# Agent instructions

This repo holds the Anthropic directory listings for Busymate AI: the connector submission material and the plugin bundle in `plugin/`. It does not own the MCP server.

- This repo will be **public**. Commit nothing internal: no private source paths, issue numbers, admin tool names, credentials, tokens or reviewer passwords.
- Server changes (tools, descriptions, annotations, OAuth, privacy page, reviewer workspace) belong in the Busymate product source repo.
- Claude's annotation rule: read tools are `readOnlyHint:true, destructiveHint:false`; every tool that modifies data is `destructiveHint:true`. Every tool has a `title`. `submission/tools.json` must match the live server.
- Lazy auth: the pre-auth `tools/list` shows every tool a workspace admin can use and protected calls return HTTP 401 with `WWW-Authenticate`, never an `isError` result. The server is `https://busymate.ai/mcp`, the same for every AI assistant; `https://busymate.ai/mcp/claude` is a permanent alias of it.
- Everything users install lives inside `plugin/`. No `.DS_Store`, symlinks, LFS, hooks, local server commands, lockfiles or `.npmrc` there.
- Raise `version` in `plugin/.claude-plugin/plugin.json` with every release and add a `CHANGELOG.md` entry; the directory picks up each push to the tracked branch.
- Run `node scripts/validate.mjs` and `claude plugin validate plugin` before every commit. Work on a branch and land through a PR.
