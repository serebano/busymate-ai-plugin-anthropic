# Changelog

## 1.1.0

- One server for every AI assistant: the plugin connects to `https://busymate.ai/mcp`. Installs on `https://busymate.ai/mcp/claude` keep working; that address is the same server.
- The tools are the server's full list for a workspace admin (359), filtered by the signed-in user's role. Every tool has a title; reads are read-only and not destructive; every tool that changes data is destructive, so Claude asks before it runs.
- `submission/tools.json` is generated from the server's catalogue.

## 1.0.0 (unreleased)

- v1 scope is 14 tools: the email tools return in a later version once the reviewer workspace has a mailbox.
- Publisher is EFIRITY PTE. LTD.; privacy, terms and support point at busymate.ai/apps/.
- Email replies use `send_email_reply`.
- Initial plugin bundle: remote MCP server, inbox-triage and knowledge-answers skills.
- Connector listing draft and declared tool profile.
