#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const katasSource = readFileSync(resolve(__dirname, '../src/data/katas.ts'), 'utf8');

const urls = [...katasSource.matchAll(/githubUrl:\s*['"`](https:\/\/github\.com\/[^'"`]+)['"`]/g)].map(
  (match) => match[1],
);

if (urls.length === 0) {
  console.error('No githubUrl entries found in src/data/katas.ts');
  process.exit(1);
}

console.log(`Checking ${urls.length} kata repositories...\n`);

const results = await Promise.all(
  urls.map(async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      return { url, status: res.status, ok: res.ok };
    } catch (error) {
      return { url, status: 0, ok: false, error: error.message };
    }
  }),
);

const failed = results.filter((r) => !r.ok);
for (const { url, status, ok, error } of results) {
  const mark = ok ? 'OK ' : 'FAIL';
  console.log(`[${mark}] ${status || 'ERR'}  ${url}${error ? `  (${error})` : ''}`);
}

if (failed.length > 0) {
  console.error(`\n${failed.length}/${urls.length} kata link(s) broken.`);
  process.exit(1);
}

console.log(`\nAll ${urls.length} kata links reachable.`);
