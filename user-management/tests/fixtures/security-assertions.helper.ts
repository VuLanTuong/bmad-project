import { expect, type APIResponse } from '@playwright/test';

export async function expectPolicyDenied(response: APIResponse) {
  expect([401, 403, 404]).toContain(response.status());
}

export async function expectNoSensitiveLeak(text: string) {
  // TODO: tighten this matcher with known PII/secret patterns.
  expect(text).not.toContain('password');
}
