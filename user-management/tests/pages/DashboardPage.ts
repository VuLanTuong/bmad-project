import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly userList: Locator;
  readonly userCount: Locator;
  readonly addUserButton: Locator;
  readonly addUserModal: Locator;
  readonly addUserForm: Locator;
  readonly newUserName: Locator;
  readonly newUserEmail: Locator;
  readonly newUserPassword: Locator;
  readonly createUserSubmit: Locator;
  readonly userDataModal: Locator;
  readonly makeAdminButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Admin Dashboard/i });
    this.searchInput = page.locator('#searchInput');
    this.userList = page.locator('#userList');
    this.userCount = page.locator('#userCount');
    this.addUserButton = page.locator('#addUserBtn');
    this.addUserModal = page.locator('#addUserModal');
    this.addUserForm = page.locator('#addUserForm');
    this.newUserName = page.locator('#newUserName');
    this.newUserEmail = page.locator('#newUserEmail');
    this.newUserPassword = page.locator('#newUserPassword');
    this.createUserSubmit = page.locator('#addUserForm button[type="submit"]');
    this.userDataModal = page.locator('#userDataModal');
    this.makeAdminButton = page.locator('#makeAdmin');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.userList).toBeVisible();
  }

  rowForEmail(email: string) {
    return this.userList.getByRole('listitem').filter({ hasText: email });
  }

  async expectUserInList(email: string) {
    await expect(this.rowForEmail(email)).toBeVisible();
  }

  async expectUserNotInList(email: string) {
    await expect(this.rowForEmail(email)).toHaveCount(0);
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async deleteUserRow(email: string) {
    const row = this.rowForEmail(email);
    await row.hover();
    await row.locator('button.delete-user-button').click();
  }

  async openAddUserModal() {
    await this.addUserButton.click();
    await expect(this.addUserModal).toBeVisible();
  }

  async createUserInModal(name: string, email: string, password: string) {
    await this.openAddUserModal();
    await this.newUserName.fill(name);
    await this.newUserEmail.fill(email);
    await this.newUserPassword.fill(password);
    await this.createUserSubmit.click();
  }

  async openUserDetailsByEmail(email: string) {
    const row = this.rowForEmail(email);
    await row.locator('.d-flex.align-items-center').click();
    await expect(this.userDataModal).toBeVisible();
  }
}
