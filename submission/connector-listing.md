# Connector listing: Busymate AI

Draft copy for the **MCP connector** submission at [claude.ai/directory/manage](https://claude.ai/directory/manage). Reviewer credentials go into the portal only, never here.

## Basics

| Field | Value |
|---|---|
| Name | Busymate AI |
| Slug | `busymate-ai` (permanent; the marketing site's "Add to Claude" button links to `claude.ai/directory/busymate-ai`) |
| Server URL | `https://busymate.ai/mcp` |
| Transport | Streamable HTTP |
| Auth | OAuth 2.1 with PKCE and dynamic client registration; lazy auth (tools are listed before sign-in, and calls need sign-in) |
| Categories (1–5) | Customer support; Productivity; Business. Use the closest portal names. |
| Docs | `https://busymate.ai/docs/guides/claude-connector` |
| Privacy | `https://busymate.ai/apps/privacy` |
| Terms | `https://busymate.ai/apps/terms` |
| Support | `https://busymate.ai/apps/support` · hi@busymate.ai |
| Icon | `plugin/assets/logo.png` (512×512 PNG) |

## One-liner (200 characters max)

Work your Busymate AI inbox, handoff requests and knowledge from a Claude conversation.

## Description (2,000 characters max)

Official copy from the marketing site (busymate.ai/connectors/claude and its source strings); do not reword here.

Work your Busymate AI inbox, handoff requests and knowledge from a Claude conversation.

Add the Busymate AI connector from Claude's connector directory and sign in with your own account. Claude can then list your workspaces, show inbox counts, read transcripts, open and answer handoff requests, and search or add knowledge — with your role's permissions, and a reply to a customer waits for your approval before it is sent.

Nothing to paste: you sign in with your Busymate AI account, and the connector acts with your role in each workspace.

## Data handling answers

| Question | Answer |
|---|---|
| Reads or writes | Both. Writes: replies to customers in the website chat, resolving handoffs, internal notes, adding a knowledge source. |
| API ownership | Own first-party API |
| Personal data | Yes: end-customer names, contact details they shared and their messages, from the user's own workspace |
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
| 3 | Add an internal note to the custom cake request saying the baker will call tomorrow. | `list_tenant_interventions`, then `add_tenant_intervention_note` after approval. The customer does not see it. |
| 4 | What does our knowledge base say about return windows? | `search_knowledge`. Quotes the policy and names the source. |
| 5 | Give me the code to put the assistant on my website. | `get_install_snippet`. Returns the snippet and where to paste it. |

Out of scope, to state if asked: changing plans or billing, deleting data, and workspaces the user does not belong to.

## Reviewer access (instructions only)

Paste into the portal's reviewer instructions. Credentials are in the Vault as `DIRECTORY_REVIEWER_EMAIL` / `DIRECTORY_REVIEWER_PASSWORD` and go only into the portal's credential fields.

```
Busymate AI — reviewer access

1. Connect the Busymate AI connector (claude.ai Settings > Connectors). If asked for a server URL, use https://busymate.ai/mcp.
2. When asked to sign in, you land on https://busymate.ai/login. Enter the reviewer email and password provided in this submission. It is email and password only: no MFA, no email code, no sign-up. Then approve the consent screen.
3. The account owns the workspace "Demo Bakery", a fictional bakery that also sells baking equipment. All customers, addresses and orders in it are invented.
4. Things to try:
   - "Which of my workspaces have open handoff requests?" (list_tenants, get_tenant_inbox_counts)
   - "Show recent customer conversations and open one transcript" (list_tenant_conversations, get_tenant_conversation_transcript)
   - "List the open handoff requests in Demo Bakery." Five customers asked for a person, including a warranty claim for a replacement DB-500 dough hook (list_tenant_interventions, get_tenant_intervention)
   - "Reply to the dough hook warranty request saying a replacement ships on Monday", then "add an internal note", then "resolve it" (reply_tenant_intervention, add_tenant_intervention_note, resolve_tenant_intervention). Replies appear only in the customer's website chat; nothing is emailed or texted to anyone.
   - "What is the returns policy?" and "How long does delivery take?" (search_knowledge, list_tenant_knowledge_sources). "Add https://example.com as a knowledge source" (add_tenant_knowledge_source)
   - "Give me the install snippet for the chat widget" (get_install_snippet)
5. To create a fresh handoff, chat as a customer at https://demo-bakery.busymate.ai/ and ask for a human. The request appears in the tools above within seconds.
6. The workspace is safe to change. If it looks different from this description, another review session may have resolved items; create new ones as in step 5.
```

## Compliance

Accept the acknowledgements only after the checklist in [`../docs/submission-checklist.md`](../docs/submission-checklist.md) is complete.
