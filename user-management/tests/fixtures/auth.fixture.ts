import { test as base, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';

type AppFixtures = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  homePage: HomePage;
  dashboardPage: DashboardPage;
  /** Logs in as seeded admin (alice@mail.co). */
  pageAsAdmin: void;
  /** Logs in as seeded regular user (bob@mail.co). */
  pageAsUser: void;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  pageAsAdmin: async ({ page, loginPage, homePage }, use) => {
    await loginPage.goto();
    await loginPage.login('alice@mail.co', 'pass');
    await homePage.expectLoaded();
    await expect(page.locator('#email')).toContainText('alice@mail.co');
    await use();
  },

  pageAsUser: async ({ page, loginPage, homePage }, use) => {
    await loginPage.goto();
    await loginPage.login('bob@mail.co', 'pass');
    await homePage.expectLoaded();
    await expect(page.locator('#email')).toContainText('bob@mail.co');
    await use();
  },
});

export { expect } from '@playwright/test';
