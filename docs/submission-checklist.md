# Anthropic directory submission checklist

Checked against Claude's developer docs on 2026-10-12. Recheck the linked pages before each submission.

Sources:
- [Directory publishing](https://claude.com/docs/directory/publish)
- [Connector submission](https://claude.com/docs/connectors/building/submission)
- [Review criteria](https://claude.com/docs/connectors/building/review-criteria)
- [Authentication](https://claude.com/docs/connectors/building/authentication)
- [Lazy authentication](https://claude.com/docs/connectors/building/lazy-authentication)
- [Submit a plugin](https://claude.com/docs/plugins/submit)
- [Plugin pre-submission checklist](https://claude.com/docs/plugins/pre-submission-checklist)
- [Software Directory Policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy)
- [Software Directory Terms](https://support.claude.com/en/articles/13145338-anthropic-software-directory-terms)

`H` = blocks or fails review. `S` = recommended.

Two submissions from the same organization: first the **MCP connector** (by URL), then the **plugin bundle** (this repo, plugin path `plugin`). They pair because they point at the same server.

## Account

- [x] H Submitting needs a paid Claude plan. Busymate is on the **Team** plan, which qualifies.
- [ ] H A Team **Owner** opens the developer portal and submits both the connector and the plugin. A member without the Owner role cannot submit.
- [ ] H The organization's GitHub account is connected on claude.ai and can push to this repo. For a private repo, the Claude GitHub App must be installed and the source-upload consent given.
- [ ] H The repo is public before the plugin goes live.

## Server (in the Busymate product repo)

- [ ] H Streamable HTTP at a public HTTPS URL, reachable from Anthropic's egress range `160.79.104.0/21`, with no WAF or CDN blocks on the MCP path or `/.well-known/*`.
- [ ] H OAuth 2.0/2.1 with PKCE. The callback `https://claude.ai/api/mcp/auth_callback` is accepted. Discovery, registration and token respond within 10 seconds, and refresh within 30.
- [ ] H One auth model, applied consistently. With lazy auth, `initialize` and `tools/list` work before sign-in and list every tool a workspace admin can use, and a protected `tools/call` returns HTTP 401 with `WWW-Authenticate`. Never return an `isError` result for missing auth, because Claude then shows no Connect button.
- [ ] H Protected-resource metadata gives the server's `resource` URL (`https://busymate.ai/mcp`), served at the path-suffixed and root well-known locations.
- [ ] H The listed tools are exactly what a signed-in user can call. Admin-only tools a reviewer cannot use fail review.
- [ ] H Each tool has a `title` and the applicable hints. Reads are `readOnlyHint:true`. Anything that modifies data is `destructiveHint:true`, and destructive tools always prompt.
- [ ] H Descriptions say exactly what the tool does. They contain no instructions aimed at the model, no references to other tools, no promotion of products or services, and no internal references.
- [ ] H Every tool succeeds with valid parameters. Errors are specific and actionable, not "Internal Server Error". Authenticated policy denials come back as `isError` results with a next step.
- [ ] H Results are frugal: pagination and field selection on lists, no full dumps. The default Claude Code limit is about 25k tokens per result.
- [ ] S CIMD support (`client_id_metadata_document_supported`), and `offline_access` in `scopes_supported` for refresh tokens.
- [ ] S If UI widgets ship, `ui.domain` matches Claude's hashed format for the server URL. v1 ships without UI.

## Policy and privacy

- [ ] H The privacy policy covers data Claude receives through tool results, server logging, retention and revocation.
- [ ] H There is a public docs page covering purpose, setup, tools and troubleshooting.
- [ ] H No prohibited categories, financial transactions or sponsored content. The data-handling answers are accurate.

## Connector listing

- [ ] H Name, slug (permanent), one-liner, description, 1–5 categories, icon, privacy, terms, support and docs URLs. See [`../submission/connector-listing.md`](../submission/connector-listing.md).
- [ ] H At least 3 example prompts, each verified end to end on claude.ai as a custom connector.
- [ ] H The reviewer account has a fully populated workspace and step-by-step access, and its outbound email goes to a sink.

## Plugin bundle (`plugin/`)

- [ ] H `node scripts/validate.mjs`, `claude plugin validate plugin` and the portal's **Validate** report no blocking findings.
- [ ] H The name is lowercase with hyphens and not a reserved word, and nothing presents the plugin as official.
- [ ] H The README has at least 40 words and discloses everything the plugin connects to. There is a LICENSE.
- [ ] H There are no credentials anywhere, no `.DS_Store`, symlinks or LFS files, and every file is under 256 KiB, or under 5 MiB for images.
- [ ] H The data-handling step (personal data, other destinations, retention, under-18) and all four compliance acknowledgements are complete.
- [ ] S Raise `version` with every release. Set up the GitHub push webhook for updates.

## After submission

- Submissions are scanned automatically and listed as **Community** by default. Listings Anthropic finds highly useful are escalated to **Verified**, where reviewers run every tool, so meet the criteria from day one.
- Claude syncs tools from the server, so tool changes need no resubmission. Listing-visible tool names change through the portal.
- An organization can create at most 10 submissions in 24 hours, and has one submission per repo and folder.

## Submission status

Updated 2026-10-26.

| Item | Id | State |
|---|---|---|
| MCP connector listing `busymate-ai` | server `ebe9e5fd-1ba9-46eb-b2b8-d0ec9cfd4636` | Published (Community). An edit is in review: server URL `https://busymate.ai/mcp` (was `/mcp/claude`, which stays a permanent alias for organizations that added it there) and the official one-liner and description. Authentication: always required, Dynamic Client Registration. |
| Plugin `busymate-ai` | plugin `3d321809-93c1-414d-812d-81b41257fd14` | v1.0.0 (`505456c`) live. v1.1.0 (`ba1ee20`, this repo's `main`) passed its scan; **Publish update** was recorded on 2026-10-26 and waits for an Anthropic reviewer. The listing still shows v1.0.0 live until then. |
