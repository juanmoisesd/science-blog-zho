import { test, expect } from '@playwright/test';

test('homepage has title and author info', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await expect(page).toHaveTitle(/科学博客/);
  await expect(page.locator('text=胡安·莫伊塞斯·德·拉·塞尔纳')).toBeVisible();
  await page.screenshot({ path: 'verification/final/home.png', fullPage: true });
});

test('psychology page lists posts', async ({ page }) => {
  await page.goto('http://localhost:4321/psychology');
  await expect(page.locator('h1')).toContainText('心理学文章');
  await page.screenshot({ path: 'verification/final/psychology.png', fullPage: true });
});

test('neuroscience page lists posts', async ({ page }) => {
  await page.goto('http://localhost:4321/neuroscience');
  await expect(page.locator('h1')).toContainText('神经科学文章');
  await page.screenshot({ path: 'verification/final/neuroscience.png', fullPage: true });
});

test('a single post page has content and author', async ({ page }) => {
  await page.goto('http://localhost:4321/posts/psychology/post-1');
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('text=胡安·莫伊塞斯·德·拉·塞尔纳')).toBeVisible();
  await page.screenshot({ path: 'verification/final/post.png', fullPage: true });
});
