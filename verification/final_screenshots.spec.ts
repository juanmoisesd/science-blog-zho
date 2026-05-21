import { test, expect } from '@playwright/test';

test('homepage screenshot', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.screenshot({ path: 'verification/final_home.png', fullPage: true });
});

test('post screenshot', async ({ page }) => {
  await page.goto('http://localhost:4321/posts/psychology/post-1');
  await page.screenshot({ path: 'verification/final_post.png', fullPage: true });
});
