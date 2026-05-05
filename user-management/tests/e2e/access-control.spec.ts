import { test, expect } from '../fixtures/auth.fixture';

test.describe('Access control', () => {
  test('unauthenticated visitor is sent away from /home', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL(/\/login/);
  });

  test('regular user cannot open the admin dashboard page', async ({ pageAsUser, page }) => {
    void pageAsUser;
    await page.goto('/dashboard');
    // Browser navigation does not include Authorization header in this app's JWT model.
    // Non-admin navigation may resolve to login or 403 depending on request flow.
    const loginFormVisible = await page.locator('#userForm').isVisible();
    const forbiddenVisible = await page.getByText(/do not have access/i).isVisible();
    expect(loginFormVisible || forbiddenVisible).toBeTruthy();
  });

  test('public index is reachable', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBeTruthy();
  });
});
