#!/usr/bin/env node
// Regenerates submission/tools.json from the LIVE server, as a signed-in Claude
// client (OAuth client registered with the claude.ai callback) sees it.
//
//   BUSYMATE_MCP_TOKEN=<reviewer token> node scripts/gen-tools.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'submission/tools.json');
const url = 'https://busymate.ai/mcp';
const token = process.env.BUSYMATE_MCP_TOKEN;
if (!token) { console.error('gen-tools: set BUSYMATE_MCP_TOKEN'); process.exit(1); }

const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-06-18', authorization: `Bearer ${token}` }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }) });
const text = await res.text();
const body = text.startsWith('{') ? text : text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5)).pop();
const tools = JSON.parse(body).result.tools;

const J = {
  ro: 'Only reads data in a workspace the signed-in user belongs to; it changes nothing.',
  rw: 'Changes data in a workspace the signed-in user manages, or acts on its behalf.',
  dRead: 'Reads only, so nothing is changed or removed.',
  dWrite: 'Changes or removes workspace data, so it is marked destructive and Claude asks the user before every call.',
  owClosed: "Acts only inside the user's own Busymate AI workspace.",
  owOpen: 'Reaches people or systems outside the workspace: a customer, an email or phone address, a web address the user names, or a connected third-party account.',
};
const first = (d) => (d || '').split(/(?<=\.)\s/)[0].slice(0, 300);
// busymate-ai-src#3207 — `dataReturned` (the 14 app tools' allowlisted fields) is kept across regenerations.
const previous = fs.existsSync(OUT) ? new Map(JSON.parse(fs.readFileSync(OUT, 'utf8')).tools.map((t) => [t.name, t.dataReturned])) : new Map();
const out = {
  _note: 'The tools of the Busymate AI MCP server at https://busymate.ai/mcp as a signed-in workspace admin sees them from Claude. Generated from the live server by scripts/gen-tools.mjs; scripts/scan-live.mjs compares it with the live tools/list.',
  serverUrl: url,
  tools: tools.map((t) => {
    const a = t.annotations || {};
    return {
      name: t.name,
      title: t.title || a.title,
      summary: first(t.description),
      annotations: { readOnlyHint: a.readOnlyHint, destructiveHint: a.destructiveHint, openWorldHint: a.openWorldHint },
      justifications: {
        readOnlyHint: a.readOnlyHint ? J.ro : J.rw,
        destructiveHint: a.destructiveHint ? J.dWrite : J.dRead,
        openWorldHint: a.openWorldHint ? J.owOpen : J.owClosed,
      },
      ...(previous.get(t.name) ? { dataReturned: previous.get(t.name) } : {}),
    };
  }),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`gen-tools: ${out.tools.length} tools -> submission/tools.json`);
