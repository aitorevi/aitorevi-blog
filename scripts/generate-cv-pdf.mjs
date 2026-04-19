/**
 * generate-cv-pdf.mjs — Build-time PDF generation for the CV pages
 *
 * ─────────────────────────────────────────────
 * CÓMO FUNCIONA
 * ─────────────────────────────────────────────
 * 1. Se invoca al final del build: `astro build && node scripts/generate-cv-pdf.mjs`
 * 2. Levanta un servidor HTTP estático que sirve el directorio dist/client/
 *    (donde el adapter @astrojs/vercel deposita los HTML estáticos tras el build).
 * 3. Abre Chromium headless via Playwright y navega a las páginas de impresión:
 *    - /cv/print/      → CV en español (diseño ATS)
 *    - /en/cv/print/   → CV en inglés (diseño ATS)
 * 4. Genera un PDF A4 de cada página y lo guarda en dos sitios (ver abajo).
 *
 * ─────────────────────────────────────────────
 * POR QUÉ DOS DIRECTORIOS DE SALIDA
 * ─────────────────────────────────────────────
 * dist/client/cv/  → Salida primaria. El adapter de Vercel copia dist/client/
 *                    a .vercel/output/static/, así que los PDFs quedan servidos
 *                    en el deployment actual sin pasos extra.
 *
 * public/cv/       → Copia de seguridad commiteada en git. Astro copia public/
 *                    a dist/client/ al inicio de cada build, así que si Playwright
 *                    falla en Vercel, los PDFs del commit anterior siguen disponibles.
 *
 * ─────────────────────────────────────────────
 * CHROMIUM: LOCAL vs VERCEL
 * ─────────────────────────────────────────────
 * Local:  usa el Chromium instalado por Playwright (playwright install chromium).
 * Vercel: usa @sparticuz/chromium, un build de Chromium optimizado para entornos
 *         serverless/Lambda. Se detecta via process.env.VERCEL.
 *         Nota: @sparticuz/chromium está en dependencies (no devDependencies)
 *         para que Vercel lo instale durante el build.
 *
 * ─────────────────────────────────────────────
 * DATOS DEL CV
 * ─────────────────────────────────────────────
 * La fuente de verdad es src/data/cv.ts. Los PDFs siempre están en sync porque
 * se generan a partir del HTML renderizado de las páginas de print, que leen
 * directamente de cv.ts.
 *
 * ─────────────────────────────────────────────
 * ACTUALIZAR LOS PDFs MANUALMENTE
 * ─────────────────────────────────────────────
 * Si cambias src/data/cv.ts, ejecuta `npm run build` para regenerar los PDFs.
 * Los nuevos archivos en public/cv/ deben commitearse para que el fallback esté
 * actualizado. En el próximo deploy de Vercel, Playwright también los regenerará.
 */
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { join, extname, resolve as resolvePath } from 'node:path';
import { existsSync } from 'node:fs';

// dist/client/ es donde @astrojs/vercel deposita los HTML estáticos.
// El adapter solo despliega dist/client/ → .vercel/output/static/,
// por eso los PDFs deben escribirse ahí para llegar a producción.
const SERVE_DIR = join(import.meta.dirname, '..', 'dist', 'client');
const DEPLOY_CV_DIR = join(import.meta.dirname, '..', 'dist', 'client', 'cv');
const PUBLIC_CV_DIR = join(import.meta.dirname, '..', 'public', 'cv');
const PORT = 4173;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const CV_PAGES = [
  { url: '/cv/print/', filename: 'aitor-reviriego-cv-ats-es.pdf' },
  { url: '/en/cv/print/', filename: 'aitor-reviriego-cv-ats-en.pdf' },
];

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      let filePath = join(SERVE_DIR, req.url);

      // Guard against path traversal attacks
      if (!resolvePath(filePath).startsWith(resolvePath(SERVE_DIR))) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      if (filePath.endsWith('/')) {
        filePath = join(filePath, 'index.html');
      }

      if (!existsSync(filePath) && existsSync(filePath + '.html')) {
        filePath += '.html';
      }

      if (existsSync(filePath) && !filePath.includes('.')) {
        filePath = join(filePath, 'index.html');
      }

      try {
        const content = await readFile(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(PORT, () => {
      console.log(`Static server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function launchBrowser() {
  if (process.env.VERCEL) {
    const { default: sparticuzChromium } = await import('@sparticuz/chromium');
    return chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
      headless: true,
    });
  }
  return chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

async function generatePdf(url, filename) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    const fullUrl = `http://localhost:${PORT}${url}`;
    console.log(`Navigating to ${fullUrl}`);

    await page.goto(fullUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // Primary output: dist/client/cv/ → included in Vercel deployment
    const deployPath = join(DEPLOY_CV_DIR, filename);
    await page.pdf({
      path: deployPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
    });

    // Fallback copy: public/cv/ → committed to git, always available
    const publicPath = join(PUBLIC_CV_DIR, filename);
    await copyFile(deployPath, publicPath);

    console.log(`Generated: ${filename}`);
  } finally {
    await browser.close();
  }
}

async function generatePdfs() {
  console.log('Starting CV PDF generation...');

  await mkdir(DEPLOY_CV_DIR, { recursive: true });
  await mkdir(PUBLIC_CV_DIR, { recursive: true });

  const server = await startServer();

  try {
    for (const { url, filename } of CV_PAGES) {
      await generatePdf(url, filename);
    }
  } finally {
    server.close();
  }

  console.log('CV PDF generation complete!');
}

generatePdfs().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
