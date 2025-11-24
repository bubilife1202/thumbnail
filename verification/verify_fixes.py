from playwright.sync_api import sync_playwright

def verify_interaction_fix():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use large viewport
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        try:
            print("Navigating...")
            page.goto("http://localhost:3000")
            page.wait_for_selector('canvas')
            page.wait_for_timeout(2000)

            # 1. Verify Floating Menu Position
            # Click on the center of the canvas where the template title usually is
            # For 1280x720, center is 640,360 relative to canvas
            # In browser window, canvas is centered.
            # Let's blindly click center of screen
            page.mouse.click(960, 540)
            page.wait_for_timeout(500)

            # The floating menu should appear.
            # We want to verify it's NEAR the object.
            # Visually, we just take a screenshot.
            page.screenshot(path="verification/4_menu_position_fix.png")
            print("Captured menu position")

            # 2. Verify Snapping
            # Drag the object slightly off center and release
            # It should snap back or close to center
            # Mouse down
            page.mouse.move(960, 540)
            page.mouse.down()
            # Move slightly right
            page.mouse.move(970, 540) # +10px
            page.mouse.up()

            page.wait_for_timeout(500)
            page.screenshot(path="verification/5_snapping_check.png")
            print("Captured snapping check")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_interaction_fix()
