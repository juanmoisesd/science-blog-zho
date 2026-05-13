import { test, expect } from '@playwright/test';

test('login and check import page', async ({ page }) => {
  // Set a longer timeout for the whole test
  test.setTimeout(120000);

  console.log('Navigating to login page...');
  await page.goto('https://juanmoisesdelaserna.es/wp-login.php', { waitUntil: 'networkidle' });

  console.log('Filling credentials...');
  await page.fill('#user_login', 'DoctorenPsicologia');
  await page.fill('#user_pass', 'dp&LVjv3Y%Vbn!C5pu)w)4');

  console.log('Clicking login...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('#wp-submit'),
  ]);

  console.log('Final URL:', page.url());

  if (page.url().includes('wp-admin')) {
    console.log('SUCCESS: Logged into WordPress');
    await page.goto('https://juanmoisesdelaserna.es/wp-admin/import.php', { waitUntil: 'networkidle' });
    console.log('Import page reached');
    await page.screenshot({ path: 'wp_import_page.png', fullPage: true });
  } else {
    console.log('FAILURE: Could not log in');
    const errorExists = await page.locator('#login_error').isVisible();
    if (errorExists) {
      const errorText = await page.locator('#login_error').innerText();
      console.log('Login Error:', errorText);
    }
    await page.screenshot({ path: 'wp_login_failure.png', fullPage: true });
  }
});
