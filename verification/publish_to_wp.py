import sys
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print("Logging in...")
            page.goto("https://juanmoisesdelaserna.es/wp-login.php")
            page.fill("#user_login", "DoctorenPsicologia")
            page.fill("#user_pass", "dp&LVjv3Y%Vbn!C5pu)w)4")
            page.click("#wp-submit")
            page.wait_for_url("**/wp-admin/**")
            print("Login successful!")

            # Go to import page
            page.goto("https://juanmoisesdelaserna.es/wp-admin/import.php")
            print("On import page.")

            # Check if WordPress importer is there
            if page.query_selector('a[href*="import=wordpress"]'):
                print("WordPress importer found.")
                # If it says "Install Now" (Instalar ahora)
                install_link = page.query_selector('a[href*="install=1"][href*="import=wordpress"]')
                if install_link:
                    print("Installing importer...")
                    install_link.click()
                    page.wait_for_load_state("networkidle")

                # Run importer
                run_link = page.query_selector('a[href*="import=wordpress"]:has-text("Ejecutar"), a[href*="import=wordpress"]:has-text("Run")')
                if run_link:
                    print("Running importer...")
                    run_link.click()
                    page.wait_for_selector('input[type="file"]')

                    print("Uploading XML...")
                    page.set_input_files('input[type="file"]', 'wordpress_export.xml')
                    page.click('input[type="submit"]')

                    page.wait_for_selector('select[name^="user_map"]', timeout=60000)
                    print("Assigning author...")
                    selects = page.query_selector_all('select[name^="user_map"]')
                    for s in selects:
                        s.select_option(label="DoctorenPsicologia")

                    page.click('input[type="submit"]')
                    page.wait_for_load_state("networkidle")
                    print("Import process finished.")
                    page.screenshot(path="import_finished_python.png")
                else:
                    print("Could not find 'Run Importer' link.")
            else:
                print("WordPress importer not found in the list.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="error_python.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
