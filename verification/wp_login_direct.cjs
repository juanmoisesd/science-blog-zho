const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    console.log('Navigating to login page...');
    await page.goto('https://juanmoisesdelaserna.es/wp-login.php', { waitUntil: 'networkidle' });

    await page.fill('#user_login', 'DoctorenPsicologia');
    await page.fill('#user_pass', 'dp&LVjv3Y%Vbn!C5pu)w)4');

    console.log('Submitting login form...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('#wp-submit'),
    ]);

    console.log('Current URL:', page.url());
    const content = await page.content();
    if (page.url().includes('wp-admin')) {
      console.log('SUCCESS: Logged into WordPress Dashboard');
      const dashboardText = await page.innerText('#wpbody-content h1');
      console.log('Dashboard Heading:', dashboardText);
    } else {
      console.log('FAILURE: Could not log in');
      const errorText = await page.innerText('#login_error');
      console.log('Error Message:', errorText);
    }
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
