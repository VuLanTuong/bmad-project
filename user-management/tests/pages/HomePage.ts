import { expect, type Locator, type Page } from '@playwright/test';

/** User home rendered after login; DOM ids come from homepage.html */
export class HomePage {
  readonly page: Page;
  readonly emailLabel: Locator;
  readonly displayName: Locator;
  readonly dashboardButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailLabel = page.locator('#email');
    this.displayName = page.locator('#user');
    this.dashboardButton = page.locator('#dashboard');
    this.logoutButton = page.locator('#logout');
  }

  async expectLoaded() {
    await expect(this.logoutButton).toBeVisible();
    await expect(this.emailLabel).toBeVisible();
  }

  async expectDashboardButtonHidden() {
    await expect(this.dashboardButton).toBeHidden();
  }

  async openDashboardViaUi() {
    await this.dashboardButton.click();
    await expect(this.page.locator('#userList')).toBeVisible();
  }

  async gotoDashboardRouteDirect() {
    // TODO: Use this for deep-link authorization checks.
    await this.page.goto('/dashboard');
  }

  async expectUnauthorizedRedirect() {
    // TODO: Tighten this assertion to match final redirect policy.
    await expect(this.page).toHaveURL(/\/(login|403)$/);
  }

  async logout() {
    await this.logoutButton.click();
  }
}
