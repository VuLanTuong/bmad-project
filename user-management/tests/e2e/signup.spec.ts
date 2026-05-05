import { test, expect } from '../fixtures/auth.fixture';

test.describe('Sign up', () => {
  test('registers a new user and lands on the home view', async ({ page, signupPage, homePage }) => {
    const email = `e2e.${Date.now()}@register.test`;
    await signupPage.goto();
    await signupPage.register('E2E User', email, 'password12');

    await homePage.expectLoaded();
    await expect(page.locator('#email')).toHaveText(email);
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('jwt')))
      .toBeTruthy();
  });

  test('rejects duplicate email with a visible error', async ({ page, signupPage }) => {
    const email = `e2e.${Date.now()}@dup.test`;
    await signupPage.goto();
    await signupPage.register('First', email, 'password12');
    await expect(page.locator('#logout')).toBeVisible();

    await page.goto('/signup');
    await signupPage.register('Second', email, 'password99');

    await signupPage.expectErrorVisible();
    await expect(signupPage.stateBanner).toContainText(/exists|taken|already/i);
  });
});
