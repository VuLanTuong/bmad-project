import { test, expect } from '../fixtures/auth.fixture';

test.describe('Admin dashboard', () => {
  test('loads users from the API after opening from home', async ({
    pageAsAdmin,
    homePage,
    dashboardPage,
  }) => {
    void pageAsAdmin;
    await homePage.openDashboardViaUi();
    await dashboardPage.expectLoaded();

    await expect
      .poll(async () => dashboardPage.userList.locator('.user-list-item').count())
      .toBeGreaterThan(2);
    await dashboardPage.expectUserInList('alice@mail.co');
    await dashboardPage.expectUserInList('bob@mail.co');
  });

  test('search input filters the rendered list', async ({ pageAsAdmin, homePage, dashboardPage }) => {
    void pageAsAdmin;
    await homePage.openDashboardViaUi();
    await dashboardPage.expectLoaded();

    await dashboardPage.search('bob');
    await expect(dashboardPage.rowForEmail('bob@mail.co')).toBeVisible();
    await expect(dashboardPage.rowForEmail('alice@mail.co')).toBeHidden();
  });

  test('add user modal creates a user row', async ({ pageAsAdmin, homePage, dashboardPage }) => {
    void pageAsAdmin;
    await homePage.openDashboardViaUi();
    await dashboardPage.expectLoaded();
    const before = await dashboardPage.userList.locator('.user-list-item').count();

    const email = `e2e.${Date.now()}@modal.test`;
    await dashboardPage.createUserInModal('Modal User', email, 'password12');
    await expect(dashboardPage.addUserModal).toBeHidden();

    await expect(dashboardPage.userList.locator('.user-list-item')).toHaveCount(before + 1, {
      timeout: 15_000,
    });
    await dashboardPage.expectUserInList(email);
  });

  test('delete control removes a disposable user row', async ({ pageAsAdmin, homePage, dashboardPage }) => {
    void pageAsAdmin;
    await homePage.openDashboardViaUi();
    await dashboardPage.expectLoaded();

    const email = `e2e.${Date.now()}@delete.test`;
    await dashboardPage.createUserInModal('Delete Me', email, 'password12');
    await dashboardPage.expectUserInList(email);

    const before = await dashboardPage.userList.locator('.user-list-item').count();
    await dashboardPage.deleteUserRow(email);

    await expect(dashboardPage.userList.locator('.user-list-item')).toHaveCount(before - 1, {
      timeout: 15_000,
    });
    await dashboardPage.expectUserNotInList(email);
  });

  test('user row opens details modal with profile fields', async ({
    pageAsAdmin,
    homePage,
    dashboardPage,
    page,
  }) => {
    void pageAsAdmin;
    await homePage.openDashboardViaUi();
    await dashboardPage.expectLoaded();

    await dashboardPage.openUserDetailsByEmail('bob@mail.co');
    await expect(dashboardPage.userDataModal.locator('#email')).toContainText('bob@mail.co');
    await expect(dashboardPage.userDataModal.locator('#authorities')).toBeVisible();
    await expect(page.locator('#userDataModal .modal-title')).toContainText(/User Data/i);
  });
});
