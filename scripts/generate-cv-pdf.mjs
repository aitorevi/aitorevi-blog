import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { existsSync } from 'node:fs';

const DIST_DIR = join(import.meta.dirname, '..', 'dist');
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
  { url: '/cv/print/', output: 'cv/aitor-reviriego-cv-ats-es.pdf' },
  { url: '/en/cv/print/', output: 'cv/aitor-reviriego-cv-ats-en.pdf' },
];

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      let filePath = join(DIST_DIR, req.url);

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

async function generatePdfs() {
  console.log('Starting CV PDF generation...');

  const server = await startServer();

  let browser;
  if (process.env.VERCEL) {
    const { default: sparticuzChromium } = await import('@sparticuz/chromium');
    browser = await chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
      headless: true,
    });
  } else {
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  try {
    for (const { url, output } of CV_PAGES) {
      const page = await browser.newPage();
      const fullUrl = `http://localhost:${PORT}${url}`;
      console.log(`Navigating to ${fullUrl}`);

      await page.goto(fullUrl, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);

      const outputPath = join(DIST_DIR, output);
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0', bottom: '0', left: '0', right: '0' },
      });

      console.log(`Generated: ${output}`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('CV PDF generation complete!');
}

generatePdfs().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
