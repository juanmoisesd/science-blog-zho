import { test, expect } from '@playwright/test';

test('login to wordpress and verify dashboard', async ({ page }) => {
  await page.goto('https://juanmoisesdelaserna.es/wp-login.php');
  await page.fill('#user_login', 'DoctorenPsicologia');
  await page.fill('#user_pass', 'dp&LVjv3Y%Vbn!C5pu)w)4');
  await page.click('#wp-submit');

  await page.waitForURL('**/wp-admin/**');
  console.log('Successfully logged in. Current URL:', page.url());

  const dashboardTitle = await page.title();
  console.log('Dashboard Title:', dashboardTitle);

  // Create a directory for screenshots if it doesn't exist
  const fs = require('fs');
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  await page.screenshot({ path: 'screenshots/wp_dashboard.png' });
});
