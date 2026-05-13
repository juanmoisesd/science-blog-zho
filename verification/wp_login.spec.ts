import { test, expect } from '@playwright/test';

test('login to wordpress', async ({ page }) => {
  await page.goto('https://juanmoisesdelaserna.es/wp-login.php');
  await page.fill('#user_login', 'DoctorenPsicologia');
  await page.fill('#user_pass', 'dp&LVjv3Y%Vbn!C5pu)w)4');
  await page.click('#wp-submit');

  // Wait for dashboard or error
  await page.waitForTimeout(5000);
  const url = page.url();
  console.log('Final URL after login:', url);

  if (url.includes('wp-admin')) {
    console.log('Login successful!');
    await page.screenshot({ path: 'wp_dashboard.png' });
  } else {
    console.log('Login failed.');
    await page.screenshot({ path: 'wp_failed.png' });
  }
});
