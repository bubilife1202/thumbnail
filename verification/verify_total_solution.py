from playwright.sync_api import sync_playwright

def verify_solutions():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Large viewport to see controls
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        try:
            # 1. Load App
            print("Navigating to app...")
            page.goto("http://localhost:3000")
            page.wait_for_selector('canvas')
            page.wait_for_timeout(2000) # Wait for initial template

            # 2. Verify Initial Template (YouTube Red Aggro)
            # We can't easily check canvas content, but we can check if template name updated?
            # Or just take screenshot
            page.screenshot(path="verification/1_initial_load.png")
            print("Captured initial load")

            # 3. Verify Smart Resize
            # Change size to Instagram Story (9:16)
            print("Changing canvas size...")
            # Open dropdown
            page.click("button >> text=YouTube")
            # Select Instagram Story (assuming it's in the list)
            # We need to find the button. The text might be "Instagram - Story" or similar based on data
            # Let's look for text "Instagram" and "Story"
            page.click("text=Instagram 스토리")

            page.wait_for_timeout(1000)
            page.screenshot(path="verification/2_resized_smart.png")
            print("Captured resized canvas")

            # 4. Verify Floating Menu
            # Click on the center of the canvas to select the main text object
            # Coordinates depend on canvas size/position.
            # Let's try to click roughly where the text 'SUMMER SALE' or 'Shop Now' would be
            # Center of screen roughly
            page.mouse.click(960, 540)
            page.wait_for_timeout(500)

            # Check for floating menu buttons (Duplicate/Delete icons are hard to query by text)
            # But the menu container has specific classes.
            # We can just screenshot
            page.screenshot(path="verification/3_floating_menu.png")
            print("Captured floating menu")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_solutions()
