import { test, expect } from '@playwright/test';

test.describe('Auth lifecycle API', () => {
  test('TODO API-P0-001 register authenticate logout lifecycle @api @p0', async ({ request }) => {
    // TODO: implement register -> authenticate -> logout -> re-authenticate flow.
    expect(request).toBeTruthy();
  });
});
