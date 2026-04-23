import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // Start each test with no consent cookie
  await context.clearCookies();
});

test('banner appears on first visit', async ({ page }) => {
  await page.goto('/');
  const banner = page.locator('#cookie-consent');
  await expect(banner).toBeVisible();
});

test('accepting hides the banner and sets cookie', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-cookie-accept]').first().click();
  await expect(page.locator('#cookie-consent')).toBeHidden();

  const cookies = await page.context().cookies();
  const consent = cookies.find((c) => c.name === 'aitorevi_consent');
  expect(consent?.value).toBe('granted');
});

test('rejecting hides the banner and sets cookie to denied', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-cookie-reject]').first().click();
  await expect(page.locator('#cookie-consent')).toBeHidden();

  const cookies = await page.context().cookies();
  const consent = cookies.find((c) => c.name === 'aitorevi_consent');
  expect(consent?.value).toBe('denied');
});

test('banner does not reappear after consent is given', async ({ page, context }) => {
  await page.goto('/');
  await page.locator('[data-cookie-accept]').first().click();

  // Navigate to another page and come back
  await page.goto('/blog');
  await page.goto('/');
  await expect(page.locator('#cookie-consent')).toBeHidden();
});
