import { expect, type Locator, type Page } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly stateBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('#registerForm');
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#registerForm #username');
    this.passwordInput = page.locator('#registerForm #password');
    this.termsCheckbox = page.locator('#terms');
    this.submitButton = page.locator('#registerForm button#btn');
    this.stateBanner = page.locator('#state');
  }

  async goto() {
    await this.page.goto('/signup');
    await expect(this.form).toBeVisible();
  }

  async register(name: string, email: string, password: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.termsCheckbox.check();
    await this.submitButton.click();
  }

  async expectErrorVisible() {
    await expect(this.stateBanner).toBeVisible();
  }
}
