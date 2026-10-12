# Connector listing: Busymate AI

Draft copy for the **MCP connector** submission at [claude.ai/directory/manage](https://claude.ai/directory/manage). Reviewer credentials go into the portal only, never here.

## Basics

| Field | Value |
|---|---|
| Name | Busymate AI |
| Slug | `busymate-ai` (permanent; confirm before publishing) |
| Server URL | `https://busymate.ai/mcp/claude` |
| Transport | Streamable HTTP |
| Auth | OAuth 2.1 with PKCE and dynamic client registration; lazy auth (tools are listed before sign-in, and calls need sign-in) |
| Categories (1–5) | Customer support; Productivity; Business. Use the closest portal names. |
| Docs | `https://busymate.ai/docs/guides/claude` (to be published) |
| Privacy | `https://busymate.ai/privacy` |
| Terms | `https://busymate.ai/terms` |
| Support | `https://busymate.ai/contact` · hi@busymate.ai |
| Icon | `plugin/assets/logo.png` (512×512 PNG) |

## One-liner (200 characters max)

Review and answer your Busymate AI customer conversations, handoff requests and email from Claude, and search your workspace knowledge.

## Description (2,000 characters max)

Busymate AI is the assistant that answers a business's customers on its website and by email, using the business's own knowledge. This connector lets owners and support staff work their Busymate inbox from Claude:

- see which workspaces have open conversations and handoff requests;
- read customer conversations, handoff requests and email threads;
- reply to customers, resolve handoff requests and leave internal notes, each after you approve it in Claude;
- search workspace knowledge, and add a public web page as a knowledge source;
- get the snippet that installs the assistant on your website.

Sign in with your Busymate AI account. The connector sees only the workspaces you belong to. Workspace setup, billing, team management and channel connections stay in the Busymate Console.

## Data handling answers

| Question | Answer |
|---|---|
| Reads or writes | Both. Writes: customer replies, resolving handoffs, internal notes, adding a knowledge source. |
| API ownership | Own first-party API |
| Personal data | Yes: end-customer names, email addresses and messages from the user's own workspace |
| Data sent to other services | No. Adding a knowledge source fetches the public page the user names. |
| Health data | No |
| Sponsored content | No |
| Financial transactions | No |
| AI media generation | No |
| Intended for under 18 | No |

## Example prompts (at least 3)

| # | Prompt | Expected behaviour |
|---|---|---|
| 1 | Which customer conversations need my attention today? | `list_tenants`, `get_tenant_inbox_counts`, `list_tenant_interventions`. Lists the open handoffs by customer first name, topic and wait time. |
| 2 | Reply to the warranty question saying we will ship a replacement part on Monday, then mark it resolved. | `get_tenant_intervention`, then `reply_tenant_intervention` and `resolve_tenant_intervention`, each approved in Claude. Confirms both. |
| 3 | Find the latest unanswered email about delivery and answer that orders ship within 3 days. | `search_email`, `get_email_thread`, then `reply_email` after approval. |
| 4 | What does our knowledge base say about return windows? | `search_knowledge`. Quotes the policy and names the source. |
| 5 | Give me the code to put the assistant on my website. | `get_install_snippet`. Returns the snippet and where to paste it. |

Out of scope, to state if asked: changing plans or billing, deleting data, and workspaces the user does not belong to.

## Reviewer access (instructions only)

1. Connect the connector in Claude and sign in with the reviewer account given in the portal. It uses email and password, with no MFA.
2. The account owns the workspace **Demo Bakery**, which holds seeded conversations, handoff requests, email threads and knowledge sources.
3. Replies and email from this workspace go to a test mailbox, so every write tool is safe to run.
4. The workspace is reset nightly.

## Compliance

Accept the acknowledgements only after the checklist in [`../docs/submission-checklist.md`](../docs/submission-checklist.md) is complete.
