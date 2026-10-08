import { test, expect } from '../utils/fixtures';
import { ERRORS, PASSWORD, USERS } from '../utils/test-data';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-001 standard_user can log in and sees the product list', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('TC-002 locked_out_user is blocked with a clear error', async ({ page, loginPage }) => {
    await loginPage.login(USERS.lockedOut);

    await expect(loginPage.errorMessage).toHaveText(ERRORS.lockedOut);
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('TC-003 valid username with wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, 'wrong_password');

    await expect(loginPage.errorMessage).toHaveText(ERRORS.badCredentials);
  });

  test('TC-004 unknown username is rejected', async ({ loginPage }) => {
    await loginPage.login('not_a_real_user', PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(ERRORS.badCredentials);
  });

  test('TC-005 empty username shows "Username is required"', async ({ loginPage }) => {
    await loginPage.login('', PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(ERRORS.usernameRequired);
  });

  test('TC-006 empty password shows "Password is required"', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, '');

    await expect(loginPage.errorMessage).toHaveText(ERRORS.passwordRequired);
  });

  test('TC-007 problem_user can log in', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.problem);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('TC-008 problem_user sees a unique image for every product [BUG-001]', async ({ loginPage, inventoryPage }) => {
    test.fail(true, 'Known bug BUG-001: every product shows the same placeholder image for problem_user');
    await loginPage.login(USERS.problem);

    const sources = await inventoryPage.getImageSources();
    expect(sources).toHaveLength(6);
    expect(new Set(sources).size).toBe(sources.length);
  });

  test('TC-009 user can log out and protected pages require login again', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard);
    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();

    await inventoryPage.goto();
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
    await expect(inventoryPage.inventoryItems).toHaveCount(0);
    await expect(page.getByTestId('login-button')).toBeVisible();
  });
});
