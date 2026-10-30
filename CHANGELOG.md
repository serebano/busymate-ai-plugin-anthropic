# Changelog

## 1.1.1

- Data disclosure (busymate-ai-src#3207): the 14 directory-profile tools return only allowlisted fields to a Claude app connection, and `submission/tools.json` lists them per tool (`dataReturned`). The apps privacy policy lists every category with purpose, source and retention. `list_api_keys` and `revoke_api_key` are no longer offered to Claude apps.
- `plugin.json` sets every listing field the directory reads: `icon`, `documentationUrl`, `supportUrl`, `privacyPolicyUrl`, `termsOfServiceUrl`. The 1.0.0 listing has a malformed support link and an expired icon; the directory reads these fields only when a submission is created, so the owner corrects the listing with **Edit** (see `docs/submission-checklist.md`).
- `plugin/README.md` points at the privacy section that lists the returned data.

## 1.1.0

- Server URL is `https://busymate.ai/mcp`, the one Busymate AI server for every AI assistant. `https://busymate.ai/mcp/claude` remains a permanent alias.
- Listing and plugin descriptions use the official copy from busymate.ai/connectors/claude.
- `submission/tools.json` lists the tools a signed-in workspace admin gets from Claude (306). It is generated from the live server by `scripts/gen-tools.mjs`.

## 1.0.0 (unreleased)

- v1 scope is 14 tools: the email tools return in a later version once the reviewer workspace has a mailbox.
- Publisher is EFIRITY PTE. LTD.; privacy, terms and support point at busymate.ai/apps/.
- Email replies use `send_email_reply`.
- Initial plugin bundle: remote MCP server, inbox-triage and knowledge-answers skills.
- Connector listing draft and declared tool profile.
