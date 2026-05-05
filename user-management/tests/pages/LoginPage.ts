import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly stateBanner: Locator;
  readonly signupLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('#userForm');
    this.emailInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#userForm button#btn');
    this.stateBanner = page.locator('#state');
    this.signupLink = page.getByRole('link', { name: /sign up here/i });
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.form).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectErrorVisible() {
    await expect(this.stateBanner).toBeVisible();
    await expect(this.stateBanner).not.toHaveCSS('visibility', 'hidden');
  }
}
