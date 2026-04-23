import { test, expect } from '@playwright/test';

test('language switcher goes from ES home to EN home', async ({ page }) => {
  await page.goto('/');
  await page.locator('nav a[href="/en/"]').first().click();
  await expect(page).toHaveURL(/\/en\//);
});

test('language switcher goes from EN home to ES home', async ({ page }) => {
  await page.goto('/en/');
  await page.locator('nav a[href="/"]').first().click();
  await expect(page).toHaveURL(/^http:\/\/localhost:\d+\/$/);
});

test('language switcher preserves the CV route', async ({ page }) => {
  await page.goto('/cv');
  await page.locator('nav a[href="/en/cv/"]').first().click();
  await expect(page).toHaveURL(/\/en\/cv/);
});

test('language switcher preserves the blog route', async ({ page }) => {
  await page.goto('/blog');
  await page.locator('nav a[href="/en/blog/"]').first().click();
  await expect(page).toHaveURL(/\/en\/blog/);
});
