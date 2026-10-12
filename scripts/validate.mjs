#!/usr/bin/env node
// Offline checks that mirror the Claude directory's plugin validation for the
// rules we can test locally. `claude plugin validate plugin` covers the schema;
// the portal's Validate button remains the real gate.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = path.join(ROOT, 'plugin');
const errors = [];
const fail = (msg) => errors.push(msg);
const readJson = (abs) => JSON.parse(fs.readFileSync(abs, 'utf8'));

const manifest = readJson(path.join(PLUGIN, '.claude-plugin/plugin.json'));
const mcp = readJson(path.join(PLUGIN, '.mcp.json'));
const tools = readJson(path.join(ROOT, 'submission/tools.json'));

// Name rules.
const RESERVED = ['claude', 'anthropic', 'official', 'plugin', 'mcp', 'test'];
if (!/^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?$/.test(manifest.name ?? '')) fail('plugin.json: name must be lowercase letters, digits and hyphens, 64 max');
if (RESERVED.includes(manifest.name)) fail('plugin.json: name is a reserved word');
if (/\b(official|claude|anthropic)\b/i.test(`${manifest.name} ${manifest.displayName ?? ''}`)) fail('plugin.json: name must not present the plugin as official or Anthropic-made');
for (const k of ['description', 'author', 'version', 'license']) if (!manifest[k]) fail(`plugin.json: ${k} should be set`);

// README of at least 40 words outside code blocks, with the disclosures the security scan looks for.
const readme = fs.readFileSync(path.join(PLUGIN, 'README.md'), 'utf8');
const prose = readme.replace(/```[\s\S]*?```/g, '');
const words = prose.split(/\s+/).filter((w) => /\w/.test(w)).length;
if (words < 40) fail(`plugin/README.md: ${words} words, at least 40 needed outside code blocks`);
for (const url of Object.values(mcp.mcpServers ?? {}).map((s) => s.url)) if (!readme.includes(url)) fail(`plugin/README.md must disclose the MCP server ${url}`);
for (const link of ['https://busymate.ai/apps/privacy', 'https://busymate.ai/apps/terms']) if (!readme.includes(link)) fail(`plugin/README.md must link ${link}`);
if (!fs.existsSync(path.join(PLUGIN, 'LICENSE')) && !manifest.license) fail('plugin: LICENSE file or license field required');

// Remote MCP servers only, https, no headers or secrets.
for (const [name, s] of Object.entries(mcp.mcpServers ?? {})) {
  if (!['http', 'sse', 'ws'].includes(s.type)) fail(`.mcp.json ${name}: type must be http (remote)`);
  if (!/^(https|wss):\/\//.test(s.url ?? '')) fail(`.mcp.json ${name}: url must be https`);
  if (s.headers && Object.keys(s.headers).length) fail(`.mcp.json ${name}: no headers; auth is OAuth`);
  if (s.command) fail(`.mcp.json ${name}: no local command; this plugin only connects to the hosted server`);
  if (s.url !== tools.serverUrl) fail(`.mcp.json ${name}: url differs from submission/tools.json serverUrl`);
}

// Files: no system files, symlinks, oversized or uninspectable binaries.
const BIN_OK = /\.(png|jpe?g|gif|webp|svg|woff2?|ttf|otf)$/i;
let count = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    const rel = path.relative(ROOT, abs);
    count += 1;
    if (['.DS_Store', 'Thumbs.db', 'desktop.ini', '__MACOSX'].includes(e.name)) fail(`${rel}: system file`);
    if (e.isSymbolicLink()) { fail(`${rel}: symlink`); continue; }
    if (!/^[A-Za-z0-9._-]+$/.test(e.name)) fail(`${rel}: use letters, digits, dots, hyphens and underscores only`);
    if (e.isDirectory()) { walk(abs); continue; }
    const size = fs.statSync(abs).size;
    if (BIN_OK.test(e.name)) { if (size > 5 * 1024 * 1024) fail(`${rel}: over 5 MiB`); continue; }
    if (size > 256 * 1024) fail(`${rel}: over 256 KiB (held for a reviewer)`);
    const head = fs.readFileSync(abs).subarray(0, 8000);
    if (head.includes(0)) fail(`${rel}: binary file that the validator cannot inspect`);
    if (/(sk-[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|"(password|client_secret|api_key)"\s*:)/.test(head.toString())) fail(`${rel}: looks like a credential`);
  }
})(PLUGIN);
if (count > 512) fail(`plugin: ${count} entries, keep it to 512 files`);
for (const f of ['package.json', 'package-lock.json', '.npmrc', 'hooks']) if (fs.existsSync(path.join(PLUGIN, f))) fail(`plugin/${f}: not expected in a connector-only plugin`);

// Skills: front matter with a single-string description, under 1024 characters.
const skillsDir = path.join(PLUGIN, 'skills');
for (const s of fs.existsSync(skillsDir) ? fs.readdirSync(skillsDir) : []) {
  const md = fs.readFileSync(path.join(skillsDir, s, 'SKILL.md'), 'utf8');
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  const desc = fm?.[1].match(/^description:\s*(.+)$/m)?.[1];
  if (!desc) fail(`skills/${s}: front matter needs a description`);
  else if (desc.length > 1024) fail(`skills/${s}: description over 1024 characters`);
  if (fm?.[1].match(/^name:\s*(.+)$/m)?.[1] !== s) fail(`skills/${s}: name must match its folder`);
  for (const tool of md.matchAll(/`([a-z]+(?:_[a-z]+)+)`/g)) if (!tools.tools.some((t) => t.name === tool[1])) fail(`skills/${s}: uses undeclared tool ${tool[1]}`);
}

// Declared tools follow Claude's rule: reads are read-only, every write is destructive.
for (const t of tools.tools) {
  const a = t.annotations ?? {};
  if (typeof a.readOnlyHint !== 'boolean' || typeof a.destructiveHint !== 'boolean') fail(`tools.json ${t.name}: readOnlyHint and destructiveHint must be booleans`);
  if (a.readOnlyHint === a.destructiveHint) fail(`tools.json ${t.name}: a tool is either read-only or destructive under Claude's rule`);
}

if (errors.length) {
  console.error(`validate: ${errors.length} problem(s)\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`validate: ok (${tools.tools.length} tools, ${words}-word README)`);
