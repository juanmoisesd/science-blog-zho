import { test, expect } from '@playwright/test';

test('import xml to wordpress', async ({ page }) => {
  test.setTimeout(300000);

  console.log('Logging in...');
  await page.goto('https://juanmoisesdelaserna.es/wp-login.php');
  await page.fill('#user_login', 'DoctorenPsicologia');
  await page.fill('#user_pass', 'dp&LVjv3Y%Vbn!C5pu)w)4');
  await Promise.all([
    page.waitForNavigation(),
    page.click('#wp-submit'),
  ]);

  console.log('Navigating to import page...');
  await page.goto('https://juanmoisesdelaserna.es/wp-admin/import.php');

  // Look for WordPress importer
  const runImporter = page.locator('a[href*="import=wordpress"]');
  const count = await runImporter.count();
  console.log(`Found ${count} WordPress importer links`);

  if (count > 0) {
    const firstLink = runImporter.first();
    const text = await firstLink.innerText();
    console.log(`Clicking link: ${text}`);
    await Promise.all([
      page.waitForNavigation(),
      firstLink.click(),
    ]);

    if (await page.locator('input[type="file"]').isVisible()) {
      console.log('Uploading XML...');
      await page.setInputFiles('input[type="file"]', 'wordpress_export.xml');
      await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"]'),
      ]);

      console.log('Step 2: Assign authors');
      // Just click submit to use default user mappings or try to find selects
      await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"]'),
      ]);

      console.log('Import completed.');
      await page.screenshot({ path: 'wp_import_final.png' });
    } else {
      console.log('Could not find file input. Maybe need to install importer.');
      await page.screenshot({ path: 'wp_import_missing_input.png' });
    }
  } else {
    console.log('WordPress importer not listed.');
    await page.screenshot({ path: 'wp_import_missing_importer.png' });
  }
});
