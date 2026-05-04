import { chromium } from 'playwright';
import fs from 'fs';

const axeSource = fs.readFileSync('./node_modules/axe-core/axe.min.js', 'utf8');
const pages = ['/', '/blog', '/work', '/cv', '/en', '/en/blog', '/en/work', '/en/cv'];

const browser = await chromium.launch({ headless: true });
let totalViolations = 0;

for (const path of pages) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    await page.goto(`http://localhost:4321${path}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.evaluate(axeSource);

    const results = await page.evaluate(async () => {
      return await window.axe.run({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag22aa'] } });
    });

    const totalNodes = results.violations.reduce((sum, v) => sum + v.nodes.length, 0);
    totalViolations += totalNodes;
    console.log(`${path.padEnd(20)} ${results.violations.length} rule violations / ${totalNodes} elements`);

    for (const v of results.violations) {
      console.log(`  • [${v.id}] ${v.nodes.length}× — ${v.description.slice(0, 80)}`);
      for (const node of v.nodes.slice(0, 3)) {
        const data = node.any[0]?.data || {};
        const extra = data.contrastRatio ? ` (${data.fgColor} on ${data.bgColor} = ${data.contrastRatio})` : '';
        console.log(`     ${node.html.slice(0, 100)}${extra}`);
      }
    }
  } catch (e) {
    console.log(`${path}: ERROR — ${e.message}`);
  }
  await ctx.close();
}

console.log(`\n=== TOTAL: ${totalViolations} violations across ${pages.length} pages ===`);
await browser.close();
process.exit(totalViolations > 0 ? 1 : 0);
