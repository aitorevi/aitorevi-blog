#!/usr/bin/env node
/**
 * Pre-commit hook: normalizes image filenames in public/images/blog/
 *
 * Convention:
 *   {slug}-cover.{ext}   ← cover image (was coverImage.{ext})
 *   {slug}-1.{ext}       ← first content image (alphabetical order)
 *   {slug}-2.{ext}       ← second content image, etc.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { extname, basename } from 'path';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

// Get staged files
const staged = run('git diff --cached --name-only').split('\n').filter(Boolean);

// Extract affected slugs from staged markdown files and staged image files
const affectedSlugs = new Set();

for (const file of staged) {
  const mdMatch = file.match(/^src\/content\/blog\/(?:es|en)\/(.+)\.md$/);
  if (mdMatch) affectedSlugs.add(mdMatch[1]);

  const imgMatch = file.match(/^public\/images\/blog\/([^/]+)\//);
  if (imgMatch) affectedSlugs.add(imgMatch[1]);
}

if (affectedSlugs.size === 0) process.exit(0);

for (const slug of affectedSlugs) {
  const imgDir = `public/images/blog/${slug}`;

  // Get all git-known files in this image directory (tracked + staged new files)
  const rawFiles = run(`git ls-files --cached --others --exclude-standard "${imgDir}/"`)
    .split('\n')
    .filter(Boolean)
    .map(f => basename(f));

  if (rawFiles.length === 0) continue;

  // Separate cover from content images
  const coverFile = rawFiles.find(f => f.startsWith('coverImage.'));
  const contentFiles = rawFiles
    .filter(f => !f.startsWith('coverImage.'))
    .sort(); // alphabetical for deterministic counter

  // Build rename map: { currentName -> desiredName }
  const renameMap = new Map();

  if (coverFile) {
    const ext = extname(coverFile);
    const desired = `${slug}-cover${ext}`;
    if (coverFile !== desired) renameMap.set(coverFile, desired);
  }

  contentFiles.forEach((file, i) => {
    // Skip files already matching {slug}-N.{ext}
    const alreadyNormalized = new RegExp(`^${slug}-\\d+\\.[^.]+$`);
    if (alreadyNormalized.test(file)) return;

    const ext = extname(file);
    const desired = `${slug}-${i + 1}${ext}`;
    if (file !== desired) renameMap.set(file, desired);
  });

  if (renameMap.size === 0) continue;

  // Check for collisions before renaming anything
  for (const [current, desired] of renameMap) {
    const desiredPath = `${imgDir}/${desired}`;
    if (existsSync(desiredPath) && !renameMap.has(desired)) {
      console.error(`[normalize-naming-images] Collision: ${desiredPath} already exists. Skipping slug "${slug}".`);
      renameMap.clear();
      break;
    }
  }

  if (renameMap.size === 0) continue;

  // Find all markdown files for this slug (es + en)
  const mdFiles = [
    `src/content/blog/es/${slug}.md`,
    `src/content/blog/en/${slug}.md`,
  ].filter(existsSync);

  // Perform renames
  for (const [current, desired] of renameMap) {
    const oldPath = `${imgDir}/${current}`;
    const newPath = `${imgDir}/${desired}`;

    run(`git mv "${oldPath}" "${newPath}"`);
    console.log(`[normalize-naming-images] ${oldPath} → ${newPath}`);

    // Update references in all markdown files for this slug
    const oldPublicPath = `/images/blog/${slug}/${current}`;
    const newPublicPath = `/images/blog/${slug}/${desired}`;

    for (const mdFile of mdFiles) {
      const content = readFileSync(mdFile, 'utf-8');
      if (!content.includes(oldPublicPath)) continue;

      const updated = content.split(oldPublicPath).join(newPublicPath);
      writeFileSync(mdFile, updated, 'utf-8');
      run(`git add "${mdFile}"`);
      console.log(`[normalize-naming-images] Updated reference in ${mdFile}`);
    }
  }
}
