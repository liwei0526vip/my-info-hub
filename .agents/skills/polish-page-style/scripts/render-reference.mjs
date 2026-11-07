#!/usr/bin/env node
// Render an isolated reference artifact; never overwrite a site page or user config.
import { readFileSync, writeFileSync, existsSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const vendor = fileURLToPath(new URL('./vendor/answer-me-with-html/', import.meta.url));
const args = process.argv.slice(2);
const usage = `Usage:
  node render-reference.mjs <draft.md> [--template sheet|doc] [--theme blueprint|paper|shadcn]
  node render-reference.mjs --help-component <component>

Writes a reference HTML to a new temporary directory and prints its path as JSON.
It does not open a browser, update the renderer, or replace any project page.`;

let scratch;
try {
  if (Number(process.versions.node.split('.')[0]) < 20) throw new Error('Node.js 20+ is required.');
  if (!args.length || args[0] === '--help') {
    process.stdout.write(`${usage}\n`);
  } else {
    const engine = join(vendor, 'am.mjs');
    const meta = JSON.parse(readFileSync(join(vendor, 'upstream.json'), 'utf8'));
    const digest = createHash('sha256').update(readFileSync(engine)).digest('hex');
    if (digest !== meta.sha256) throw new Error('Renderer checksum does not match upstream.json.');
    const help = args[0] === '--help-component';
    const options = [];
    let input;
    if (help) {
      if (args.length !== 2 || !/^[a-z][a-z-]*$/.test(args[1])) throw new Error(usage);
    } else {
      if (args[0].startsWith('-')) throw new Error(usage);
      input = resolve(args[0]);
      if (!existsSync(input)) throw new Error(`Draft not found: ${input}`);
      for (let index = 1; index < args.length; index += 2) {
        const choices = { '--template': ['sheet', 'doc'], '--theme': ['blueprint', 'paper', 'shadcn'] };
        if (!choices[args[index]]?.includes(args[index + 1])) throw new Error(usage);
        options.push(args[index], args[index + 1]);
      }
    }
    scratch = mkdtempSync(join(tmpdir(), 'polish-page-style-'));
    const home = join(scratch, 'renderer-state');
    mkdirSync(home);
    writeFileSync(join(home, 'config.json'), JSON.stringify({ open: false, update_check: false, mode: 'light', style: 'off' }));
    const output = join(scratch, 'reference.html');
    const command = help ? ['help', args[1]] : ['render', input, '-o', output, '--no-open', '--mode', 'light', '--style', 'off', ...options];
    const result = spawnSync(process.execPath, [engine, ...command], {
      cwd: input ? dirname(input) : scratch,
      env: { ...process.env, AM_HOME: home, AM_NO_UPDATE_CHECK: '1' },
      encoding: 'utf8', timeout: 30_000, maxBuffer: 4 * 1024 * 1024,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error([result.stdout, result.stderr].filter(Boolean).join('\n').trim() || 'Renderer failed.');
    if (help) {
      process.stdout.write(result.stdout);
      if (result.stderr) process.stderr.write(result.stderr);
      rmSync(scratch, { recursive: true, force: true });
    } else {
      if (!existsSync(output)) throw new Error('Renderer did not produce a reference page.');
      if (result.stderr) process.stderr.write(result.stderr);
      process.stdout.write(`${JSON.stringify({ referenceHtml: output, sourceMarkdown: input, engineVersion: meta.version })}\n`);
    }
  }
} catch (error) {
  if (scratch) rmSync(scratch, { recursive: true, force: true });
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
