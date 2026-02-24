import { test, expect } from "@playwright/test";

/**
 * Home Page / Private Layout Tests
 *
 * This test suite validates the functionality of the home page and private layout.
 * It uses Playwright's authentication setup and injects mock user data into sessionStorage
 * to simulate an authenticated user session.
 *
 * @remarks
 * - Uses saved session from auth.setup.ts
 * - Injects user_data into sessionStorage before each test
 * - Tests cover: branding, user info display, logout functionality, and navigation
 */
test.describe("Home Page / Private Layout", () => {
  // We use the saved session from auth.setup.ts
  // If you didn't set it globally in playwright.config.ts,
  // you can uncomment the line below:
  // test.use({ storageState: 'playwright/.auth/user.json' });

  /**
   * Sets up the test environment before each test
   * Injects mock user data into sessionStorage and navigates to the home page
   * @param page - The Playwright page object
   */
  test.beforeEach(async ({ page }) => {
    // Inject user_data into sessionStorage BEFORE browsing
    await page.addInitScript(() => {
      const userData = {
        id: "898b660a-9829-4bfc-b29e-76b91245d97b",
        first_name: "System",
        last_name: "Admin",
        email: "admin@company.com",
        status: "ACTIVE",
        login_count: 1,
        created_at: "2026-02-24T13:11:49.847Z",
        updated_at: "2026-02-24T18:25:47.097Z",
        sessionId: "ac8cdae2-fffb-4657-b036-e8ebdcb04814",
      };

      window.sessionStorage.setItem("user_data", JSON.stringify(userData));

      // Se a sua store do Zustand usa uma chave específica para persistência:
      // window.sessionStorage.setItem("user-store", JSON.stringify({ state: { user: userData } }));
    });

    // Navigate to the home page (where the user lands after login)
    await page.goto("/home");
  });

  /**
   * Validates that the application brand/logo is displayed on the home page
   * @param page - The Playwright page object
   */
  test("should show the application brand/logo", async ({ page }) => {
    // Validates the brand name in the navbar
    await expect(page.getByText("Users Management")).toBeVisible();
  });

  /**
   * Verifies that the logged-in user information (name and email) is displayed correctly
   * Waits for the Zustand state to populate before validating the content
   * @param page - The Playwright page object
   */
  test("should display the logged-in user information", async ({ page }) => {
    const userName = page.getByLabel("user name");
    const userEmail = page.getByLabel("user email");

    // Step 1: Wait for the Zustand state to be populated.
    // We use toHaveText with a Regex to wait for any character.
    await expect(userName).toBeVisible({ timeout: 10000 });
    await expect(userEmail).toBeVisible();

    // Step 2: Now that there is text, we validate if it is visible.
    await expect(userName).toContainText(",");
    await expect(userEmail).toContainText("@");
  });

  /**
   * Tests the logout button functionality
   * Verifies that the logout button is visible and clicking it redirects to the login page
   * @param page - The Playwright page object
   */
  test("should display the logout button and handle sign out", async ({
    page,
  }) => {
    // Wait for the button to be ready
    const logoutBtn = page.getByLabel("logout button");
    await expect(logoutBtn).toBeVisible();

    // Perform logout
    await logoutBtn.click();

    // Check if redirected to login page
    await expect(page).toHaveURL(/\/login/);
  });

  /**
   * Validates that navigation links are functional
   * Tests clicking the Users link and Home link to ensure proper navigation
   * @param page - The Playwright page object
   */
  test("should have functional navigation links", async ({ page }) => {
    // Wait for links to appear
    const usersLink = page.getByRole("link", { name: "Users", exact: true });
    await usersLink.click();

    await expect(page).toHaveURL(/\/users/);

    const homeLink = page.getByRole("link", { name: "Home", exact: true });
    await homeLink.click();

    await expect(page).toHaveURL(/\/home/);
  });
});
