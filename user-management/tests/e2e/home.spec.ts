import { test, expect } from '../fixtures/auth.fixture';

test.describe('Home', () => {
  test('non-admin user does not see the dashboard entry point', async ({ pageAsUser, homePage }) => {
    void pageAsUser;
    await expect(homePage.dashboardButton).toBeHidden();
    await expect(homePage.logoutButton).toBeVisible();
  });

  test('admin user sees the dashboard entry point', async ({ pageAsAdmin, homePage }) => {
    void pageAsAdmin;
    await expect(homePage.dashboardButton).toBeVisible();
  });

  test('logout returns to the public index and clears the session token', async ({
    pageAsAdmin,
    page,
    homePage,
  }) => {
    void pageAsAdmin;
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('jwt')))
      .toBeTruthy();

    await homePage.logout();
    await page.waitForURL(/\/$/);

    expect(await page.evaluate(() => localStorage.getItem('jwt'))).toBeNull();
  });
});
