import type { APIRequestContext } from '@playwright/test';

export async function loginAsAdmin(_request: APIRequestContext): Promise<string> {
  // TODO: implement admin authentication and return bearer token.
  return '';
}

export async function loginAsUser(_request: APIRequestContext): Promise<string> {
  // TODO: implement standard-user authentication and return bearer token.
  return '';
}
