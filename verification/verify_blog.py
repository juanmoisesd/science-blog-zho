from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Go to homepage
    page.goto("http://localhost:4321")
    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/screenshots/home.png")

    # Go to Psychology section
    page.click("text=心理学")
    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/screenshots/psychology.png")

    # Click on the first post
    page.click("text=心理学专栏文章 1")
    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/screenshots/post.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
