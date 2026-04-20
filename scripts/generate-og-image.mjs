/**
 * generate-og-image.mjs — One-shot OG image generator
 *
 * Generates /public/og-image.png (1200×630) using satori (JSX → SVG) and
 * @resvg/resvg-js (SVG → PNG). The resulting PNG is committed to the repo
 * and served as a static asset — no runtime cost.
 *
 * Run with: npm run og:generate
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUTPUT_PATH = path.resolve('public/og-image.png');
const WIDTH = 1200;
const HEIGHT = 630;

async function fetchFont(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  return res.arrayBuffer();
}

// Minimal hyperscript helper that produces the node shape satori expects.
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

async function main() {
  console.log('Fetching fonts…');
  const [outfitRegular, outfitBold] = await Promise.all([
    fetchFont('https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-400-normal.ttf'),
    fetchFont('https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-900-normal.ttf'),
  ]);

  // Satori doesn't decode webp — use a PNG copy kept alongside the script.
  const avatar = await fs.readFile(path.resolve('scripts/assets/avatar-og.png'));
  const avatarDataUrl = `data:image/png;base64,${avatar.toString('base64')}`;

  const tree = h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)',
        color: '#f1f5f9',
        fontFamily: 'Outfit',
        position: 'relative',
      },
    },
    // Decorative corner accent
    h('div', {
      style: {
        display: 'flex',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '400px',
        height: '400px',
        background:
          'radial-gradient(circle at top right, rgba(94, 58, 238, 0.25), transparent 70%)',
      },
    }),
    // Top row: avatar + name
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '40px' } },
      h('img', {
        src: avatarDataUrl,
        width: 160,
        height: 160,
        style: {
          width: '160px',
          height: '160px',
          borderRadius: '80px',
          border: '4px solid rgba(94, 58, 238, 0.6)',
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
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            },
          },
          'Aitor Reviriego',
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              fontSize: 32,
              fontWeight: 400,
              marginTop: '12px',
              color: '#a78bfa',
            },
          },
          'Full Stack Developer · Lean Mind',
        ),
      ),
    ),
    // Tagline
    h(
      'div',
      {
        style: {
          display: 'flex',
          fontSize: 36,
          fontWeight: 400,
          marginTop: '60px',
          color: '#cbd5e1',
          lineHeight: 1.3,
        },
      },
      'TDD · Clean Architecture · AI-assisted development',
    ),
    // Bottom: URL
    h(
      'div',
      {
        style: {
          display: 'flex',
          position: 'absolute',
          bottom: '60px',
          left: '80px',
          fontSize: 28,
          fontWeight: 400,
          color: '#60a5fa',
          letterSpacing: '0.05em',
        },
      },
      'aitorevi.dev',
    ),
  );

  console.log('Rendering SVG with satori…');
  const svg = await satori(tree, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Outfit', data: outfitRegular, weight: 400, style: 'normal' },
      { name: 'Outfit', data: outfitBold, weight: 900, style: 'normal' },
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
