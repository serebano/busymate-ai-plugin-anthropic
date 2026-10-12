#!/usr/bin/env node
// Compares the live Claude profile with submission/tools.json. Fails closed: an
// unreachable server or an empty list is a failure.
//
//   node scripts/scan-live.mjs                          # pre-auth view (lazy auth)
//   BUSYMATE_MCP_TOKEN=<reviewer token> node scripts/scan-live.mjs
//
// Under lazy auth Claude expects the pre-auth tools/list to show the whole
// profile and protected calls to answer HTTP 401, so both runs must match.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const spec = JSON.parse(fs.readFileSync(path.join(ROOT, 'submission/tools.json'), 'utf8'));
const url = process.env.BUSYMATE_MCP_URL || spec.serverUrl;
const token = process.env.BUSYMATE_MCP_TOKEN;
const PROTOCOL = '2025-06-18';

async function rpc(method, params, sessionId) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      'mcp-protocol-version': PROTOCOL,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(sessionId ? { 'mcp-session-id': sessionId } : {}),
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: method, method, params }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status}`);
  const body = text.startsWith('{') ? text : text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5)).pop();
  const json = JSON.parse(body);
  if (json.error) throw new Error(`${method}: ${json.error.code} ${json.error.message}`);
  return { result: json.result, sessionId: res.headers.get('mcp-session-id') ?? sessionId };
}

const problems = [];
try {
  const init = await rpc('initialize', { protocolVersion: PROTOCOL, capabilities: {}, clientInfo: { name: 'busymate-plugin-scan', version: '1' } });
  const { result } = await rpc('tools/list', {}, init.sessionId);
  const live = new Map((result.tools ?? []).map((t) => [t.name, t]));
  if (live.size === 0) problems.push('tools/list returned no tools');
  for (const want of spec.tools) {
    const got = live.get(want.name);
    if (!got) { problems.push(`${want.name}: missing from the live profile${token ? '' : ' (pre-auth)'}`); continue; }
    for (const [h, v] of Object.entries(want.annotations)) if (got.annotations?.[h] !== v) problems.push(`${want.name}: ${h} is ${got.annotations?.[h]} live, ${v} declared`);
    if (!(got.title || got.annotations?.title)) problems.push(`${want.name}: no title`);
    const d = got.description ?? '';
    if (!d.trim()) problems.push(`${want.name}: empty description`);
    if (/#\d{2,}|busymate-ai#|\b(NEVER|ALWAYS)\b|\beve\b|chatgpt|devtools/i.test(d)) problems.push(`${want.name}: description has internal references or steering`);
  }
  for (const name of live.keys()) if (!spec.tools.some((t) => t.name === name)) problems.push(`${name}: live but not declared (the profile must equal the declared tools)`);
} catch (err) {
  problems.push(`could not scan ${url}: ${err.message}`);
}

if (problems.length) {
  console.error(`scan-live: ${problems.length} problem(s) at ${url}\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`scan-live: ok, ${spec.tools.length} tools match ${url}${token ? '' : ' (pre-auth)'}`);
