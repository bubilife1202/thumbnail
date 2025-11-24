from playwright.sync_api import sync_playwright

def verify_ui_overhaul():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set a large viewport to see the full UI layout
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        try:
            # Navigate to the local dev server
            page.goto("http://localhost:3000")

            # Wait for the main UI components to load
            page.wait_for_selector('header')
            page.wait_for_selector('canvas')

            # Wait a bit for fonts and canvas to settle
            page.wait_for_timeout(2000)

            # Take a screenshot of the entire application
            page.screenshot(path="verification/ui_overhaul.png", full_page=True)
            print("Screenshot saved to verification/ui_overhaul.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_ui_overhaul()
