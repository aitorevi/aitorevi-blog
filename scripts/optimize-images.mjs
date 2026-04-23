#!/usr/bin/env node
/**
 * optimize-images.mjs
 *
 * Walks `public/` and downsizes images whose longest side is wider than a
 * per-path threshold. Runs in-place, idempotent (no-op when already below
 * the threshold), hooked into `prebuild` so every `npm run build` (and
 * therefore every Vercel deploy) produces a right-sized bundle even if the
 * author committed an oversized source.
 *
 * Thresholds aim for 2× the largest display size found in the design,
 * enough for retina without overshooting.
 *
 * Usage:
 *   node scripts/optimize-images.mjs            # apply
 *   node scripts/optimize-images.mjs --dry-run  # report what would change
 */

import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PUBLIC_DIR = join(ROOT, 'public');

// Rules: pick the first rule whose `match` returns true. Match receives
// a path RELATIVE TO PUBLIC_DIR (e.g. "images/blog/foo/cover.webp").
// Sizes picked as ~1.5-2× the real display size; PageSpeed flags anything
// wider than that for mobile.
//
// Some images are exempt because they must be served at a specific size:
// - og-*.png  → Open Graph cards require 1200×630 minimum; never downsize.
// - images/portfolio/ → gallery lightbox enlarges them to near-full-viewport,
//   so we keep the originals. If this grows, add per-project rules here.
const RULES = [
  { name: 'og-social', match: (p) => /^og-.*\.(png|jpe?g|webp)$/.test(p), skip: true },
  { name: 'portfolio-gallery', match: (p) => p.startsWith('images/portfolio/'), skip: true },
  { name: 'avatar', match: (p) => /^avatar(-light)?\.(webp|png|jpe?g)$/.test(p), maxSide: 440 },
  { name: 'testimonial', match: (p) => p.startsWith('images/testimonials/'), maxSide: 112 },
  { name: 'default', match: () => true, maxSide: 960 },
];

const EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

/** Recursively yield file paths under `dir`. */
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const res = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(res);
    } else if (entry.isFile()) {
      yield res;
    }
  }
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function processFile(absPath) {
  const relPath = relative(PUBLIC_DIR, absPath);
  const ext = extname(absPath).toLowerCase();
  if (!EXTENSIONS.has(ext)) return null;

  const rule = RULES.find((r) => r.match(relPath)) ?? RULES[RULES.length - 1];

  const image = sharp(absPath, { failOn: 'none' });
  const meta = await image.metadata();
  if (!meta.width || !meta.height) return null;

  if (rule.skip) return { relPath, skipped: true, meta, rule };

  const longestSide = Math.max(meta.width, meta.height);
  if (longestSide <= rule.maxSide) return { relPath, skipped: true, meta, rule };

  const prevSize = (await stat(absPath)).size;

  if (DRY_RUN) {
    return {
      relPath,
      skipped: false,
      dry: true,
      meta,
      rule,
      prevSize,
      targetSide: rule.maxSide,
    };
  }

  // Resize, preserving format. sharp auto-detects by extension.
  const buffer = await image
    .resize({
      width: meta.width >= meta.height ? rule.maxSide : null,
      height: meta.height > meta.width ? rule.maxSide : null,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .toBuffer();

  const { writeFile } = await import('node:fs/promises');
  await writeFile(absPath, buffer);

  const newMeta = await sharp(buffer).metadata();
  const newSize = (await stat(absPath)).size;

  return {
    relPath,
    skipped: false,
    meta,
    newMeta,
    rule,
    prevSize,
    newSize,
  };
}

async function main() {
  console.log(`${DRY_RUN ? '[dry-run] ' : ''}Scanning ${PUBLIC_DIR}…\n`);

  let resized = 0;
  let skipped = 0;
  let savedBytes = 0;

  for await (const absPath of walk(PUBLIC_DIR)) {
    const result = await processFile(absPath);
    if (!result) continue;

    if (result.skipped) {
      skipped++;
      continue;
    }

    if (result.dry) {
      console.log(
        `[dry-run] would resize ${result.relPath}  ` +
          `(${result.meta.width}×${result.meta.height}, ${formatSize(result.prevSize)}) ` +
          `→ max ${result.targetSide}px  [rule: ${result.rule.name}]`
      );
      resized++;
    } else {
      const saved = result.prevSize - result.newSize;
      savedBytes += saved;
      resized++;
      console.log(
        `✓ ${result.relPath}  ` +
          `${result.meta.width}×${result.meta.height} → ${result.newMeta.width}×${result.newMeta.height}  ` +
          `(${formatSize(result.prevSize)} → ${formatSize(result.newSize)}, saved ${formatSize(saved)})  ` +
          `[rule: ${result.rule.name}]`
      );
    }
  }

  console.log(
    `\n${DRY_RUN ? '[dry-run] ' : ''}Done. ` +
      `${resized} ${DRY_RUN ? 'would be resized' : 'resized'}, ${skipped} already OK.` +
      (!DRY_RUN && resized > 0 ? `  Total saved: ${formatSize(savedBytes)}.` : '')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
