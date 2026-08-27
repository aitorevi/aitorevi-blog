/**
 * generate-og-work.mjs — One-shot OG generator for the case-study pages
 *
 * Emits /public/og/work/<slug>.png (1200×630) for every project that has its own
 * page on this site (`external: false`), using satori (JSX → SVG) and
 * @resvg/resvg-js (SVG → PNG). The PNGs are committed and served as static
 * assets — no runtime cost.
 *
 * Run with: npm run og:work
 *
 * ─────────────────────────────────────────────
 * POR QUÉ UN SOLO SCRIPT Y NO UNO POR PROYECTO
 * ─────────────────────────────────────────────
 * La fuente de verdad es src/content/projects/*.yaml, que ya trae todo lo que
 * necesita la tarjeta: number, name, year, stack y accent. Añadir un
 * caso de estudio nuevo no requiere tocar este fichero: basta con su YAML.
 *
 * ─────────────────────────────────────────────
 * POR QUÉ NO HAY VERSIÓN POR IDIOMA
 * ─────────────────────────────────────────────
 * Una sola imagen sirve para /work/x y /en/work/x. La tarjeta de LinkedIn ya
 * muestra el título y la descripción en el idioma correcto como texto debajo de
 * la imagen (salen de og:title y og:description, que sí son por idioma), así que
 * meter el tagline dentro del PNG sería redundante y duplicaría las imágenes.
 * Por eso solo se usan campos neutros: number, name, year y stack.
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { parse as parseYaml } from 'yaml';
import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECTS_DIR = path.resolve('src/content/projects');
const OUTPUT_DIR = path.resolve('public/og/work');
const WIDTH = 1200;
const HEIGHT = 630;

// Mismos hexadecimales que usa la web en modo oscuro, para que la tarjeta y la
// página se reconozcan como la misma familia.
// violet/blue/sky/emerald salen de tailwind.config (accent-*); zinc es zinc-300,
// documentado en src/components/work/WorkCinematic.astro:299.
const ACCENTS = {
  violet: '#ac91fc',
  blue: '#60a5fa',
  sky: '#38bdf8',
  emerald: '#10b981',
  zinc: '#d4d4d8',
};

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

// El slug sale del href, no del nombre del fichero: es el que usa la URL y por
// tanto el que el componente referenciará en su prop ogImage.
function slugFromHref(hrefEs) {
  return hrefEs.replace(/^\/work\//, '');
}

function buildTree(project, accent) {
  const stack = project.stack.slice(0, 6);

  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)',
        color: '#f1f5f9',
        fontFamily: 'Outfit',
        position: 'relative',
      },
    },
    // Decorative corner accent, tinted with the project's own colour.
    h('div', {
      style: {
        display: 'flex',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '460px',
        height: '460px',
        background: `radial-gradient(circle at top right, ${accent}33, transparent 70%)`,
      },
    }),

    // ── Top: number + year ──────────────────────────────────────────────
    h(
      'div',
      { style: { display: 'flex', alignItems: 'baseline', gap: '24px' } },
      h(
        'div',
        { style: { display: 'flex', fontSize: 40, fontWeight: 900, color: accent, letterSpacing: '0.05em' } },
        project.number,
      ),
      h(
        'div',
        { style: { display: 'flex', fontSize: 24, fontWeight: 400, color: '#64748b', letterSpacing: '0.15em' } },
        project.year.toUpperCase(),
      ),
    ),

    // ── Middle: el nombre del proyecto ──────────────────────────────────
    // La métrica del YAML se queda fuera: su valor no dice nada sin la etiqueta
    // ("0" · "6"), y la etiqueta es por idioma.
    h(
      'div',
      { style: { display: 'flex', fontSize: 88, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' } },
      project.name,
    ),

    // ── Bottom: stack chips + domain ────────────────────────────────────
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '28px' } },
      h(
        'div',
        { style: { display: 'flex', flexWrap: 'wrap', gap: '12px' } },
        ...stack.map((item) =>
          h(
            'div',
            {
              style: {
                display: 'flex',
                fontSize: 22,
                fontWeight: 400,
                color: accent,
                padding: '8px 20px',
                borderRadius: '999px',
                border: `1px solid ${accent}55`,
                background: `${accent}14`,
              },
            },
            item,
          ),
        ),
      ),
      h(
        'div',
        { style: { display: 'flex', fontSize: 26, fontWeight: 400, color: accent, letterSpacing: '0.05em' } },
        'aitorevi.dev',
      ),
    ),
  );
}

async function main() {
  console.log('Fetching fonts…');
  const [outfitRegular, outfitBold] = await Promise.all([
    fetchFont('https://cdn.jsdelivr.net/fontsource/fonts/outfit@5.2.8/latin-400-normal.ttf'),
    fetchFont('https://cdn.jsdelivr.net/fontsource/fonts/outfit@5.2.8/latin-900-normal.ttf'),
  ]);
  const fonts = [
    { name: 'Outfit', data: outfitRegular, weight: 400, style: 'normal' },
    { name: 'Outfit', data: outfitBold, weight: 900, style: 'normal' },
  ];

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await fs.readdir(PROJECTS_DIR)).filter((f) => f.endsWith('.yaml'));
  let written = 0;

  for (const file of files.sort()) {
    const project = parseYaml(await fs.readFile(path.join(PROJECTS_DIR, file), 'utf8'));

    // Los proyectos externos no tienen página propia en este sitio, así que no
    // hay ninguna etiqueta og:image nuestra que servir para ellos.
    if (project.external) continue;

    const accent = ACCENTS[project.accent];
    if (!accent) throw new Error(`${file}: accent desconocido "${project.accent}"`);

    const slug = slugFromHref(project.hrefEs);
    const svg = await satori(buildTree(project, accent), { width: WIDTH, height: HEIGHT, fonts });
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();

    const out = path.join(OUTPUT_DIR, `${slug}.png`);
    await fs.writeFile(out, png);
    console.log(`✓ ${slug.padEnd(20)} ${project.accent.padEnd(8)} → ${path.relative(process.cwd(), out)}`);
    written++;
  }

  console.log(`\nGenerated ${written} case-study OG images in ${path.relative(process.cwd(), OUTPUT_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
