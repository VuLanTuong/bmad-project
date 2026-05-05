import { test, expect } from '@playwright/test';

test.describe('Admin authorization API', () => {
  test('TODO API-P0-004 non-admin cannot delete user @api @p0 @admin', async ({ request }) => {
    // TODO: assert 403 for non-admin delete attempt.
    expect(request).toBeTruthy();
  });

  test('TODO API-P0-005 admin delete succeeds then returns not found @api @p0 @admin', async ({ request }) => {
    // TODO: assert delete success + idempotent second call behavior.
    expect(request).toBeTruthy();
  });

  test('TODO API-P0-006 make-admin enforces admin role @api @p0 @admin', async ({ request }) => {
    // TODO: assert anonymous/non-admin denial.
    expect(request).toBeTruthy();
  });

  test('TODO API-P0-007 make-admin succeeds for admin @api @p0 @admin', async ({ request }) => {
    // TODO: assert promotion effect.
    expect(request).toBeTruthy();
  });
});
