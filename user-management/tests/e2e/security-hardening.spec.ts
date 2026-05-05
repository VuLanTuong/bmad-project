import { test } from '../fixtures/auth.fixture';

test.describe('Security hardening', () => {
  test('TODO E2E-P0-001 prevent self-role escalation @e2e @p0 @security', async ({}) => {
    // TODO: implement privilege escalation tampering scenario.
  });

  test('TODO E2E-P0-002 deny IDOR access @e2e @p0 @security @idor', async ({}) => {
    // TODO: implement IDOR route and API manipulation checks.
  });

  test('TODO E2E-P1-005 deny deep-link admin routes @e2e @p1 @access-control', async ({}) => {
    // TODO: implement deep-link authorization checks.
  });
});
