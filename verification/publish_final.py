import sys
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        # Launch browser with a longer slow_mo to be gentler
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        page.set_default_timeout(120000) # 2 minutes timeout for everything

        try:
            print("Connecting to juanmoisesdelaserna.es...")
            # Try to reach the site first
            page.goto("https://juanmoisesdelaserna.es/wp-login.php", wait_until="networkidle")

            print("Entering credentials...")
            page.fill("#user_login", "DoctorenPsicologia")
            page.fill("#user_pass", "dp&LVjv3Y%Vbn!C5pu)w)4")

            print("Logging in...")
            with page.expect_navigation():
                page.click("#wp-submit")

            print(f"Logged in. Current URL: {page.url()}")

            if "wp-admin" not in page.url():
                print("Login failed or redirected elsewhere.")
                page.screenshot(path="login_failed.png")
                return

            # Go to import
            print("Navigating to Import page...")
            page.goto("https://juanmoisesdelaserna.es/wp-admin/import.php", wait_until="networkidle")

            # Find WordPress importer
            importer_link = page.query_selector('a[href*="import=wordpress"]')
            if not importer_link:
                print("WordPress importer not found.")
                page.screenshot(path="importer_not_found.png")
                return

            importer_text = importer_link.inner_text()
            print(f"Importer state: {importer_text}")

            if "Instalar" in importer_text or "Install" in importer_text:
                print("Installing WordPress Importer...")
                importer_link.click()
                page.wait_for_selector('a[href*="import=wordpress"]:has-text("Ejecutar"), a[href*="import=wordpress"]:has-text("Run")', timeout=60000)

            print("Executing Importer...")
            run_link = page.query_selector('a[href*="import=wordpress"]:has-text("Ejecutar"), a[href*="import=wordpress"]:has-text("Run")')
            run_link.click()
            page.wait_for_selector('input[type="file"]')

            print("Uploading wordpress_export.xml...")
            page.set_input_files('input[type="file"]', 'wordpress_export.xml')
            page.click('input[type="submit"]')

            print("Waiting for step 2 (authors)...")
            page.wait_for_selector('select[name^="user_map"]', timeout=120000)

            print("Assigning all posts to 'DoctorenPsicologia'...")
            selects = page.query_selector_all('select[name^="user_map"]')
            for s in selects:
                s.select_option(label="DoctorenPsicologia")

            print("Finalizing import...")
            page.click('input[type="submit"]')

            print("Waiting for success message...")
            page.wait_for_selector('.wrap', timeout=300000) # 5 minutes for big import

            print("IMPORT SUCCESSFUL!")
            page.screenshot(path="import_success.png")

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            page.screenshot(path="debug_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
