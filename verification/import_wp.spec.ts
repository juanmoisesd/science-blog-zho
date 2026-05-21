import { test, expect } from '@playwright/test';
import fs from 'fs';

test('import xml to wordpress', async ({ page }) => {
  test.setTimeout(300000); // 5 minutes

  console.log('Logging in...');
  await page.goto('https://juanmoisesdelaserna.es/wp-login.php');
  await page.fill('#user_login', 'DoctorenPsicologia');
  await page.fill('#user_pass', 'dp&LVjv3Y%Vbn!C5pu)w)4');
  await Promise.all([
    page.waitForNavigation(),
    page.click('#wp-submit'),
  ]);

  if (!page.url().includes('wp-admin')) {
    throw new Error('Login failed');
  }
  console.log('Logged in successfully.');

  // Go to import page
  await page.goto('https://juanmoisesdelaserna.es/wp-admin/import.php');

  // Check if WordPress importer is installed
  const installLink = page.locator('a[href*="import=wordpress"][href*="install=1"]');
  if (await installLink.isVisible()) {
    console.log('Installing WordPress Importer...');
    await Promise.all([
      page.waitForNavigation(),
      installLink.click(),
    ]);
    console.log('Importer installed.');
    // Activate and run
    await page.click('a[href*="import=wordpress"]:text("Ejecutar importador")');
  } else {
    const runLink = page.locator('a[href*="import=wordpress"]:text("Ejecutar importador")');
    if (await runLink.isVisible()) {
      await Promise.all([
        page.waitForNavigation(),
        runLink.click(),
      ]);
    } else {
       // Try English text if Spanish fails
       const runLinkEn = page.locator('a[href*="import=wordpress"]:text("Run Importer")');
       if (await runLinkEn.isVisible()) {
         await Promise.all([
           page.waitForNavigation(),
           runLinkEn.click(),
         ]);
       } else {
         throw new Error('WordPress Importer not found');
       }
    }
  }

  console.log('Uploading XML...');
  const filePath = 'wordpress_export.xml';
  await page.setInputFiles('input[type="file"]', filePath);
  await Promise.all([
    page.waitForNavigation(),
    page.click('input[type="submit"][value*="archivo"]'), // "Subir archivo e importar"
  ]);

  console.log('Assigning authors...');
  // Assign to existing user DoctorenPsicologia
  // The select name is usually user_map[1] or similar. We can try to select by text.
  const selects = await page.locator('select[name^="user_map"]').all();
  for (const select of selects) {
     await select.selectOption({ label: 'DoctorenPsicologia' });
  }

  // Check "Download and import file attachments" if wanted, but here we don't have images in XML
  // await page.check('input[name="fetch_attachments"]');

  console.log('Finalizing import...');
  await Promise.all([
    page.waitForNavigation(),
    page.click('input[type="submit"][value*="Enviar"]'), // "Enviar" or "Submit"
  ]);

  console.log('Import finished.');
  await page.screenshot({ path: 'import_result.png', fullPage: true });

  // Verify one post
  await page.goto('https://juanmoisesdelaserna.es/wp-admin/edit.php');
  await page.screenshot({ path: 'posts_list.png', fullPage: true });
});
