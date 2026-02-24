import { test, expect } from "@playwright/test";

test.describe("Users Management CRUD", () => {
  test("should list users and paginate", async ({ page }) => {
    await page.goto("/users");

    // Check if table is visible
    await expect(page.locator("table")).toBeVisible();

    const nextBtn = page.getByLabel("Next Page");
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await expect(page.getByText(/Page 2/i)).toBeVisible();
    }
  });

  test("should create a new user", async ({ page }) => {
    await page.goto("/users");

    // Using aria-label "New user"
    await page.getByLabel("New user").click();

    await page.getByPlaceholder("First Name").fill("John");
    await page.getByPlaceholder("Last Name").fill("Doe");
    await page.getByPlaceholder("Email").fill("john.doe@example.com");

    // Click Save button linked to the form
    await page.locator('button[form="edit-user"]').click();

    // Expect the new user to appear in the list
    await expect(page.getByText("John Doe")).toBeVisible();
  });

  test("should edit an existing user", async ({ page }) => {
    await page.goto("/users");

    // Using aria-label "Edit user" on the first row
    await page.getByLabel("Edit user").first().click();

    const firstNameInput = page.getByPlaceholder("First Name");
    await firstNameInput.clear();
    await firstNameInput.fill("Updated Name");

    await page.locator('button[form="edit-user"]').click();

    await expect(page.getByText("Updated Name")).toBeVisible();
  });

  test("should delete a user", async ({ page }) => {
    await page.goto("/users");

    // Handle the browser's confirm dialog automatically
    page.on("dialog", (dialog) => dialog.accept());

    // Using aria-label "Delete user" on the first row
    await page.getByLabel("Delete user").first().click();

    // Verify if the user was removed (Check for a success message if you have one)
    // Or check that the specific name is no longer visible
    await expect(page.getByText("Updated Name")).not.toBeVisible();
  });
});
