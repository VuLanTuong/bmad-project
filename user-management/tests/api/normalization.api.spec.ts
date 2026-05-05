import { test, expect } from '@playwright/test';

test.describe('Normalization API', () => {
  test('TODO API-P2-010 uppercase email normalizes correctly @api @p2', async ({ request }) => {
    // TODO: assert uppercase/lowercase auth behavior is consistent.
    expect(request).toBeTruthy();
  });
});
