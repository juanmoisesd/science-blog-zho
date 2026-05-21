const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    console.log('Taking screenshot...');
    await page.goto('http://localhost:4321/');
    await page.screenshot({ path: 'final_screenshot.png', fullPage: true });
    console.log('Screenshot saved to final_screenshot.png');
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
