import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { existsSync } from 'node:fs';

// With @astrojs/vercel, static HTML files land in dist/client/ (not dist/).
// The Vercel adapter only deploys dist/client/ → .vercel/output/static/, so
// PDFs must be written there to be served in production.
// We also write a copy to public/cv/ so they are committed to git and act as
// a fallback if Playwright ever fails on Vercel (Astro copies public/ →
// dist/client/ at the start of every build).
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
