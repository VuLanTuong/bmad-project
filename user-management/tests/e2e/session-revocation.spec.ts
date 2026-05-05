import { test } from '../fixtures/auth.fixture';

test.describe('Session revocation', () => {
  test('TODO E2E-P0-003 logout revokes across tabs @e2e @p0 @auth', async ({}) => {
    // TODO: implement multi-tab logout revocation flow.
  });

  test('TODO E2E-P0-004 password change invalidates old token @e2e @p0 @auth', async ({}) => {
    // TODO: implement old-session invalidation after password change.
  });

  test('TODO E2E-P1-008 concurrent login/logout race @e2e @p1 @auth', async ({}) => {
    // TODO: implement race condition robustness checks.
  });
});
