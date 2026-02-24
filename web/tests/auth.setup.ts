import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  // Fill in with your bank/seed's default credentials.
  await page.fill('input[name="email"]', "admin@company.com");
  await page.fill('input[name="password"]', "Admin@123");

  await page.click('button[type="submit"]');

  // Wait until you reach the Home (or Users) page to confirm your login.
  await expect(page).toHaveURL(/\/home|users/);

  // Saves the state for reuse in other tests.
  await page.context().storageState({ path: authFile });
});
