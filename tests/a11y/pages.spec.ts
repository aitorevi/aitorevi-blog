import { test } from '@playwright/test';
import { checkA11y, injectAxe } from 'axe-playwright';

const pages = ['/', '/blog', '/cv', '/work', '/en', '/en/blog'];

for (const path of pages) {
  test(`WCAG 2.2 AAA — ${path}`, async ({ page }) => {
    await page.goto(`http://localhost:4321${path}`);
    await injectAxe(page);
    await checkA11y(page, undefined, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag22aa'] },
    });
  });
}
