const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:4321/');
    await page.waitForSelector('text=胡安·莫伊塞斯·德·拉·塞尔纳', { timeout: 10000 });
    await page.screenshot({ path: 'final_home_check.png', fullPage: true });
    console.log('Homepage screenshot saved.');

    await page.goto('http://localhost:4321/posts/psychology/post-1');
    await page.waitForSelector('article', { timeout: 10000 });
    await page.screenshot({ path: 'final_post_check.png', fullPage: true });
    console.log('Post screenshot saved.');
  } catch (e) {
    console.error('Error taking screenshots:', e.message);
  } finally {
    await browser.close();
  }
})();
