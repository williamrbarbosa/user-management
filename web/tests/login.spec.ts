import { test, expect } from "@playwright/test";

/**
 * Login Page Validations Test Suite
 *
 * Comprehensive test suite for login page functionality and validation.
 * Tests cover page structure, form validation, error handling, and authentication flows.
 * All tests run with cleared storage to ensure a logged-out guest state.
 */
test.describe("Login Page Validations", () => {
  // Ensure we are testing as a logged-out guest
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  /**
   * Verifies that the login page has the correct title.
   */
  test("has title", async ({ page }) => {
    // Expect a title "to contain" User Management App.
    await expect(page).toHaveTitle(/User Management App/);
  });

  /**
   * Verifies that the login page displays both email and password input fields.
   */
  test("has email and password fields", async ({ page }) => {
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await expect(page.getByPlaceholder("Email")).toBeVisible();
    await expect(page.getByPlaceholder("Email")).toBeVisible();
  });

  /**
   * Verifies that the login page contains a sign-in button and a register URL link.
   */
  test("has login button and register url", async ({ page }) => {
    await expect(page.getByLabel("Sign Button")).toBeVisible();
    await expect(page.getByLabel("Register URL")).toBeVisible();
  });

  /**
   * Verifies that an error message is displayed when logging in with invalid credentials.
   *
   * Fills the login form with incorrect email and password, submits the form,
   * and asserts that the appropriate error message appears. Also verifies that
   * the user remains on the login page.
   */
  test("should show an error message with invalid credentials", async ({
    page,
  }) => {
    // Fill in with wrong credentials
    await page.fill('input[name="email"]', "wrong@user.com");
    await page.fill('input[name="password"]', "WrongPassword123");

    await page.getByLabel("Sign Button").click();

    // Check for the error message "The email or password entered is incorrect.".
    const errorMessage = page.locator(
      "text=/The email or password entered is incorrect./i",
    );
    await expect(errorMessage).toBeVisible();

    // Ensure we are still on the login page
    await expect(page).toHaveURL(/\/login/);
  });

  /**
   * Verifies that inactive users receive a specific error message and cannot sign in.
   *
   * Intercepts the login API endpoint to simulate an inactive user response,
   * attempts to sign in, and asserts that the inactive user error message is displayed.
   * Verifies that the user remains on the login page after the failed attempt.
   */
  test("should show error message for inactive user trying to sign in", async ({
    page,
  }) => {
    const inactiveErrorMessage =
      "Your user is inactive and can't sign in. Contact the support.";

    // 1. Intercept the login API call
    // Replace '**/api/auth/login' with your actual login endpoint pattern
    await page.route("**/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          message: inactiveErrorMessage,
          error: "Unauthorized",
        }),
      });
    });

    // 2. Fill the login form
    await page.fill('input[name="email"]', "inactive@company.com");
    await page.fill('input[name="password"]', "AnyPassword123!");

    // 3. Click the Sign In button
    await page.getByLabel("Sign Button").click();

    // 4. Assert that the specific error message is visible on the UI
    // Using a regex to be flexible with casing
    const errorAlert = page.getByText(inactiveErrorMessage);
    await expect(errorAlert).toBeVisible({ timeout: 10000 });

    // 5. Ensure the user remains on the login page
    await expect(page).toHaveURL(/\/login/);
  });

  /**
   * Verifies that Zod validation errors are displayed for empty form fields.
   *
   * Attempts to submit the login form without filling in any fields and asserts
   * that the "Invalid email" validation error message is displayed.
   */
  test("should show Zod validation errors for empty fields", async ({
    page,
  }) => {
    await page.getByLabel("Sign Button").click();

    // Check for your Zod/Form error messages
    await expect(page.getByText(/Invalid email/i).first()).toBeVisible();
  });
});
