import { test, expect } from "@playwright/test";

test.describe("Registration Flow", () => {
  // Ensure we start with a clean state (not logged in)
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  /**
   * Test case for password complexity requirements:
   * - Min 6 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number or special character
   */
  test("should show error for weak password", async ({ page }) => {
    // Fill other fields correctly
    await page.getByPlaceholder("First name").fill("John");
    await page.getByPlaceholder("Last name").fill("Doe");
    await page.getByPlaceholder("Email").fill("weak@test.com");

    // Case 1: Password too short (Zod validation)
    await page.getByPlaceholder("Password", { exact: true }).fill("123");
    await page.getByPlaceholder("Confirm password").fill("123");

    // Trigger validation
    await page.getByRole("button", { name: "Create account" }).click();

    // Check for Zod specific messages
    await expect(page.getByText("Minimum 8 characters")).toBeVisible();
    await expect(
      page.getByText("Too small: expected string to have >=8 characters"),
    ).toBeVisible();

    // Case 2: Missing uppercase letter
    await page.getByPlaceholder("Password", { exact: true }).fill("123456ab!");
    await page.getByPlaceholder("Confirm password").fill("123456ab!");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText(/Password too weak/i)).toBeVisible();

    // Case 3: Missing number or special character
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill("SimplePassword");
    await page.getByPlaceholder("Confirm password").fill("SimplePassword");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText(/Password too weak/i)).toBeVisible();
  });

  test("should register a new user successfully and redirect to dashboard", async ({
    page,
  }) => {
    // Filling in the fields via placeholder (more resilient)
    await page.getByPlaceholder("First name").fill("New");
    await page.getByPlaceholder("Last name").fill("User");

    // We generated a dynamic email to avoid errors due to the 'email already exists' message in the database.
    const randomEmail = `test.${Date.now()}@example.com`;
    await page.getByPlaceholder("Email").fill(randomEmail);

    await page
      .getByPlaceholder("Password", { exact: true })
      .fill("Password123!");
    await page.getByPlaceholder("Confirm password").fill("Password123!");

    // Click on submit button
    await page.getByRole("button", { name: "Create account" }).click();

    // Checks if loader appears
    await expect(page.getByText("Creating your account...")).toBeVisible();

    // On success, redirect user to ome page
    await expect(page).toHaveURL(/\/home/);

    // Check if success toast appears
    await expect(page.getByText(/successfully/i)).toBeVisible();
  });

  test("should show error when passwords do not match", async ({ page }) => {
    await page.getByPlaceholder("First name").fill("John");
    await page.getByPlaceholder("Last name").fill("Doe");
    await page.getByPlaceholder("Email").fill("john@example.com");
    await page.getByPlaceholder("Password", { exact: true }).fill("123456");
    await page.getByPlaceholder("Confirm password").fill("654321");

    await page.getByRole("button", { name: "Create account" }).click();

    // Check if your "Passwords does not match" validation appears.
    await expect(page.getByText("Passwords does not match.")).toBeVisible();
  });
});
