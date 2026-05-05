import { test, expect } from '../fixtures/auth.fixture';

test.describe('Login', () => {
  test('admin can log in with seeded credentials', async ({ page, loginPage, homePage }) => {
    await loginPage.goto();
    await loginPage.login('alice@mail.co', 'pass');

    await homePage.expectLoaded();
    await expect(page.locator('#email')).toHaveText(/alice@mail\.co/i);
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('jwt')))
      .toMatch(/.+\..+\..+/);
  });

  test('shows an error banner for incorrect password', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('alice@mail.co', 'not-the-password');

    await loginPage.expectErrorVisible();
    await expect(loginPage.stateBanner).not.toContainText(/^\s*$/);
    expect(await page.evaluate(() => localStorage.getItem('jwt'))).toBeFalsy();
  });

  test('signup link navigates to registration', async ({ page, loginPage, signupPage }) => {
    await loginPage.goto();
    await loginPage.signupLink.click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(signupPage.form).toBeVisible();
  });

  test('regular seeded user can log in', async ({ page, loginPage, homePage }) => {
    await loginPage.goto();
    await loginPage.login('bob@mail.co', 'pass');

    await homePage.expectLoaded();
    await expect(page.locator('#email')).toContainText(/bob@mail\.co/i);
  });
});
