/**
 * Authentication setup test for Playwright.
 *
 * Performs user login with default credentials and saves the authenticated session state
 * for reuse across other tests.
 *
 * @test
 * @async
 *
 * Steps:
 * 1. Navigates to the login page
 * 2. Fills in email and password credentials
 * 3. Clicks the sign-in button
 * 4. Waits for redirect to home page
 * 5. Verifies user name element is visible
 * 6. Extracts and logs session storage
 * 7. Saves authentication context state to file for test reuse
 *
 * @example
 * // Run setup before other tests
 * npx playwright test --config=auth.setup.ts
 *
 * @note
 * Update credentials in the email and password fields before running tests in production.
 * The auth state is stored at: playwright/.auth/user.json
 */
import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  // Fill in with your bank/seed's default credentials.
  await page.fill('input[name="email"]', "admin@company.com");
  await page.fill('input[name="password"]', "Admin@123");

  await page.getByLabel("Sign Button").click();

  // Wait until you reach the Home (or Users) page to confirm your login.
  await page.waitForURL(/\/home/);

  await expect(page.getByLabel("user name")).toBeVisible({ timeout: 15000 });

  await page.evaluate(() => JSON.stringify(sessionStorage));

  // Saves the state for reuse in other tests.
  await page.context().storageState({ path: authFile });
});
