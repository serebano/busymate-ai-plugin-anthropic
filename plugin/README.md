# Busymate AI

Work your Busymate AI inbox, handoff requests and knowledge from a Claude conversation.

Use the official connector to check your inbox, answer handoff requests and search your knowledge without leaving the AI assistant you already work in. You sign in with your own account, the assistant reaches only what your role can reach, and a reply to a customer waits for your approval before it is sent.

## What it does

- Lists the Busymate workspaces you belong to and how many conversations and handoff requests are open.
- Reads customer conversations and handoff requests.
- Sends replies to customers, resolves handoff requests and adds internal notes. Claude asks you to approve each of these before it runs.
- Searches your workspace knowledge and adds a public web page as a knowledge source.
- Returns the snippet that installs the assistant on your website.

It includes two skills: **inbox-triage**, a routine for working through open handoff requests, and **knowledge-answers**, which answers questions from your workspace knowledge with sources.

## Data and connections

This plugin is published by EFIRITY PTE. LTD. (UEN 202402844G), 68 Circular Road #02-01, Singapore 049422.

The plugin connects to one remote MCP server, `https://busymate.ai/mcp`, which is the Busymate AI service. You sign in with your Busymate account through OAuth; the plugin stores no credentials. Tool results, which can include your customers' names, contact details and messages, are returned to Claude. The plugin runs no local code and sends data to no other destination. Adding a knowledge source makes Busymate fetch the public web page you name.

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
