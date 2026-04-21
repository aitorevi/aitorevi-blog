/**
 * generate-og-katas.mjs — OG image for /katas
 *
 * Generates /public/og-katas.png (1200×630) highlighting the katas section:
 * "Code Katas" headline, tagline and count of kata repos drawn from src/data/katas.ts.
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUTPUT_PATH = path.resolve('public/og-katas.png');
const WIDTH = 1200;
const HEIGHT = 630;

async function fetchFont(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  return res.arrayBuffer();
}

function h(type, props = null, ...children) {
  const flat = children.flat().filter((c) => c != null && c !== false);
  return {
    type,
    props: {
      ...(props ?? {}),
      children: flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat,
    },
  };
}

async function countKatas() {
  const src = await fs.readFile(path.resolve('src/data/katas.ts'), 'utf8');
  return (src.match(/githubUrl:\s*['"`]https:\/\/github\.com\//g) ?? []).length;
}

async function main() {
  console.log('Fetching fonts…');
  const [outfitRegular, outfitBold, jetBrainsMono] = await Promise.all([
    fetchFont('https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-400-normal.ttf'),
    fetchFont('https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-900-normal.ttf'),
    fetchFont('https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-600-normal.ttf'),
  ]);

  const katasCount = await countKatas();

  const tree = h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #000 100%)',
        color: '#f1f5f9',
        fontFamily: 'Outfit',
        position: 'relative',
      },
    },
    h('div', {
      style: {
        display: 'flex',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '500px',
        height: '500px',
        background:
          'radial-gradient(circle at top right, rgba(96, 165, 250, 0.25), transparent 70%)',
      },
    }),
    h('div', {
      style: {
        display: 'flex',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '420px',
        height: '420px',
        background:
          'radial-gradient(circle at bottom left, rgba(94, 58, 238, 0.22), transparent 70%)',
      },
    }),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            fontFamily: 'JetBrainsMono',
            fontSize: 22,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#60a5fa',
          },
        },
        '// small challenges, big lessons',
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            fontSize: 140,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginTop: '28px',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #a78bfa 60%, #60a5fa 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          },
        },
        'Code Katas',
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            fontSize: 36,
            fontWeight: 400,
            marginTop: '24px',
            color: '#cbd5e1',
            lineHeight: 1.3,
            maxWidth: '900px',
          },
        },
        'TDD, refactor and clean architecture in Java, Kotlin, TypeScript and NestJS.',
      ),
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        },
      },
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 22px',
            borderRadius: '999px',
            border: '1px solid rgba(96, 165, 250, 0.4)',
            background: 'rgba(96, 165, 250, 0.1)',
            fontFamily: 'JetBrainsMono',
            fontSize: 24,
            color: '#93c5fd',
          },
        },
        `${katasCount} katas · commit-by-commit narrative`,
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            fontSize: 28,
            fontWeight: 400,
            color: '#60a5fa',
            letterSpacing: '0.05em',
          },
        },
        'aitorevi.dev/katas',
      ),
    ),
  );

  console.log('Rendering SVG with satori…');
  const svg = await satori(tree, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Outfit', data: outfitRegular, weight: 400, style: 'normal' },
      { name: 'Outfit', data: outfitBold, weight: 900, style: 'normal' },
      { name: 'JetBrainsMono', data: jetBrainsMono, weight: 600, style: 'normal' },
    ],
  });

  console.log('Converting SVG → PNG…');
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();

  await fs.writeFile(OUTPUT_PATH, png);
  console.log(`✓ Generated ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
