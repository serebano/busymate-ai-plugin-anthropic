# Busymate AI

Busymate AI is the assistant that answers a business's customers on its website and by email, using the business's own knowledge. This plugin connects Claude to your Busymate workspace so you can review customer conversations, act on the requests your assistant handed to a person, read and answer customer email, and search your workspace knowledge without leaving Claude.

## What it does

- Lists the Busymate workspaces you belong to and how many conversations and handoff requests are open.
- Reads customer conversations, handoff requests and email threads.
- Sends replies to customers, resolves handoff requests and adds internal notes. Claude asks you to approve each of these before it runs.
- Searches your workspace knowledge and adds a public web page as a knowledge source.
- Returns the snippet that installs the assistant on your website.

It includes two skills: **inbox-triage**, a routine for working through open handoffs and email, and **knowledge-answers**, which answers questions from your workspace knowledge with sources.

## Data and connections

This plugin is published by EFIRITY PTE. LTD. (UEN 202402844G), 68 Circular Road #02-01, Singapore 049422.

The plugin connects to one remote MCP server, `https://busymate.ai/mcp/claude`, which is the Busymate AI service. You sign in with your Busymate account through OAuth; the plugin stores no credentials. Tool results, which can include your customers' names, email addresses and messages, are returned to Claude. The plugin runs no local code and sends data to no other destination. Adding a knowledge source makes Busymate fetch the public web page you name.

You see only the workspaces you are a member of. Workspace setup, billing, team management and channel connections stay in the Busymate Console.

- Privacy policy: https://busymate.ai/apps/privacy
- Terms: https://busymate.ai/apps/terms
- Support: https://busymate.ai/apps/support

## Install

In Claude Code:

```
/plugin install busymate-ai --marketplace serebano/busymate-ai-plugin-anthropic
```

On claude.ai, add Busymate AI from the directory.

## Requirements

A Busymate AI account with at least one workspace.
