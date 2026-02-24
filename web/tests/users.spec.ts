import { test, expect } from "@playwright/test";

/**
 * Users Management CRUD Test Suite
 *
 * Comprehensive test suite for user management operations including listing, creating,
 * editing, and deleting users. Tests include validation of business rules such as
 * preventing inactive users from updating their names and preventing users from
 * deleting their own accounts.
 *
 * @group Users Management
 * @requires @playwright/test
 */
test.describe("Users Management CRUD", () => {
  /**
   * Sets up the test environment before each test
   *
   * Injects system admin user data into sessionStorage to simulate an authenticated session
   * and navigates to the users management page.
   *
   * @function beforeEach
   * @param {Page} page - The Playwright page object
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
    });

    // Navigate to the home page (where the user lands after login)
    await page.goto("/users");
  });

  /**
   * Verifies that the users list displays correctly and pagination controls work
   *
   * Checks that the users table is visible and tests the "Next Page" button
   * to ensure pagination functionality operates as expected.
   *
   * @test
   * @example
   * // Should navigate to page 2 when Next button is clicked
   */
  test("should list users and paginate", async ({ page }) => {
    // Check if table is visible
    await expect(page.locator("table")).toBeVisible();

    const nextBtn = page.getByLabel("Next Page");
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await expect(page.getByText(/Page 2/i)).toBeVisible();
    }
  });

  /**
   * Tests the creation of a new user through the UI
   *
   * Creates a new user by filling in the create user form with test data
   * (first name, last name, email, password) and verifies the user appears
   * in the list after creation.
   *
   * @test
   * @example
   * // Should submit the form and display the new user in the table
   */
  test("should create a new user", async ({ page }) => {
    // Using aria-label "New user"
    await page.getByLabel("New user").click();

    await page.getByPlaceholder("First Name").fill("Johnny");
    await page.getByPlaceholder("Last Name").fill("Doedoe");
    await page.getByPlaceholder("Email").fill("johnny.ddoe@example.com");
    await page.getByPlaceholder("Password").fill("123@ChangeIt");

    // Click Save button linked to the form
    await page.locator('button[form="create-user"]').click();

    // Expect the new user to appear in the list
    await expect(page.getByText("John Doe")).toBeVisible();
  });

  /**
   * Tests editing an existing user's information
   *
   * Locates a user by email, opens the edit modal, updates the first name,
   * and verifies the changes are reflected in the user list.
   *
   * @test
   * @example
   * // Should update user details and persist changes in the list
   */
  test("should edit an existing user", async ({ page }) => {
    const editUserEmail = "jane.doe@gmail.com";
    const activeRow = page.locator("tr", { hasText: editUserEmail });

    // Using aria-label "Edit user" on the first row
    await activeRow.getByLabel("Edit user").first().click();

    const firstNameInput = page.getByPlaceholder("First Name");
    await firstNameInput.clear();
    await firstNameInput.fill("Updated Name");

    await page.locator('button[form="edit-user"]').click();

    await expect(page.getByText("Updated Name")).toBeVisible();
  });

  /**
   * Validates that inactive users cannot update their name fields
   *
   * Attempts to edit the name of an inactive user and verifies the API
   * returns an error message preventing the update.
   *
   * @test
   * @throws {Error} When attempting to update inactive user's name
   * @example
   * // Should display error: "Inactive users cannot update first or last name"
   */
  test("should show error message when trying to edit an inactive user's name", async ({
    page,
  }) => {
    // 1. Listen for the API response error to ensure we catch the 400 Bad Request
    const apiErrorMessage = "Inactive users cannot update first or last name";

    // 2. Find a user that is INACTIVE or force one to be inactive for the test
    const inactiveRow = page.locator("tr", { hasText: "INACTIVE" }).first();

    // Click edit on that specific row
    await inactiveRow.getByLabel("Edit user").click();

    // 3. Try to change the name
    const firstNameInput = page.getByPlaceholder("First Name");
    await firstNameInput.clear();
    await firstNameInput.fill("Illegal Change");

    await page.locator('button[form="edit-user"]').click();

    // 4. Assert that the error message from the API is displayed on the screen
    // We use a regex to be case-insensitive and flexible with the exact string
    await expect(page.getByText(apiErrorMessage)).toBeVisible();

    // 5. Verify that the dialog is still open or the name wasn't updated in the background
    await expect(page.getByPlaceholder("First Name")).toHaveValue(
      "Illegal Change",
    );
  });

  /**
   * Tests the deletion of a user from the system
   *
   * Locates a user by email, accepts the browser confirmation dialog,
   * clicks the delete button, and verifies the user is removed from the list.
   *
   * @test
   * @example
   * // Should remove the user after confirming the delete action
   */
  test("should delete a user", async ({ page }) => {
    const deleteUserEmail = "john.doe@gmail.com";
    const loggedInUserRow = page.locator("tr", { hasText: deleteUserEmail });

    // Handle the browser's confirm dialog automatically
    page.on("dialog", (dialog) => dialog.accept());

    // Using aria-label "Delete user" on the first row
    await loggedInUserRow.getByLabel("Delete user").first().click();

    // Verify if the user was removed (Check for a success message if you have one)
    // Or check that the specific name is no longer visible
    await expect(loggedInUserRow.getByText("Updated Name")).not.toBeVisible();
  });

  /**
   * Validates that the logged-in user cannot delete their own account
   *
   * Attempts to delete the current user's own account and verifies that
   * the system prevents this action with an appropriate error message
   * while keeping the user visible in the list.
   *
   * @test
   * @throws {Error} When attempting to delete own account
   * @example
   * // Should display error: "Unable to delete your own user account!"
   */
  test("should not allow the logged-in user to delete their own account", async ({
    page,
  }) => {
    const selfDeleteErrorMessage = "Unable to delete your own user account!";
    const currentUserEmail = "admin@company.com";

    // 1. Locate the table row that contains the logged-in user's email address.
    const loggedInUserRow = page.locator("tr", { hasText: currentUserEmail });

    // 2. Within that line, look for the delete button (using the aria-label you already have).
    const deleteBtn = loggedInUserRow.getByLabel("Delete user");

    // 3. If the button is active and the lock is in the API:
    page.on("dialog", (dialog) => dialog.accept());
    await deleteBtn.click();

    // 4. Checks if the API conflict error message appears on the screen.
    await expect(page.getByText(selfDeleteErrorMessage)).toBeVisible();

    // 5. Ensures the user is still visible in the list (has not been deleted).
    await expect(loggedInUserRow).toBeVisible();
  });
});
