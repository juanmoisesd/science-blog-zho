const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Logging in to juanmoisesdelaserna.es...');
    await page.goto('https://juanmoisesdelaserna.es/wp-login.php', { waitUntil: 'networkidle' });
    await page.fill('#user_login', 'DoctorenPsicologia');
    await page.fill('#user_pass', 'dp&LVjv3Y%Vbn!C5pu)w)4');
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    console.log('Login successful.');

    console.log('Navigating to Import page...');
    await page.goto('https://juanmoisesdelaserna.es/wp-admin/import.php', { waitUntil: 'networkidle' });

    // Check if WordPress importer is installed
    const importerLink = page.locator('a[href*="import=wordpress"]');
    const importerText = await importerLink.first().innerText();

    if (importerText.includes('Instalar') || importerText.includes('Install')) {
      console.log('Installing WordPress Importer...');
      await importerLink.first().click();
      await page.waitForSelector('a[href*="import=wordpress"]:has-text("Ejecutar"), a[href*="import=wordpress"]:has-text("Run")');
    }

    console.log('Running Importer...');
    const runLink = page.locator('a[href*="import=wordpress"]:has-text("Ejecutar"), a[href*="import=wordpress"]:has-text("Run")').first();
    await runLink.click();
    await page.waitForSelector('input[type="file"]');

    console.log('Uploading XML file...');
    await page.setInputFiles('input[type="file"]', 'wordpress_export.xml');
    await page.click('input[type="submit"]');

    await page.waitForSelector('select[name^="user_map"]', { timeout: 60000 });
    console.log('Assigning authors...');
    const selects = await page.locator('select[name^="user_map"]').all();
    for (const select of selects) {
      await select.selectOption({ label: 'DoctorenPsicologia' });
    }

    console.log('Finalizing import...');
    await page.click('input[type="submit"]');
    await page.waitForSelector('.wrap', { timeout: 120000 });

    console.log('Import finished successfully!');
    await page.screenshot({ path: 'wp_import_finished.png' });

  } catch (error) {
    console.error('An error occurred during the process:', error.message);
    await page.screenshot({ path: 'wp_error.png' });
  } finally {
    await browser.close();
  }
})();
