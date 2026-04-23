import { test, expect } from '@playwright/test';

test('dark mode toggle adds dark class to html', async ({ page }) => {
  await page.goto('/');
  await page.locator('#theme-toggle').click();
  const isDark = await page.evaluate(() =>
    document.documentElement.classList.contains('dark')
  );
  expect(isDark).toBe(true);
});

test('dark mode preference persists after reload', async ({ page }) => {
  await page.goto('/');

  // Enable dark mode
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveClass(/dark/);

  // Reload and verify it persists
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
