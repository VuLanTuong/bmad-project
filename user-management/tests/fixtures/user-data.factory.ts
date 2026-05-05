export type TestUserData = {
  name: string;
  username: string;
  password: string;
};

export function createUserData(overrides: Partial<TestUserData> = {}): TestUserData {
  const suffix = Date.now();
  return {
    name: `User ${suffix}`,
    username: `user.${suffix}@test.local`,
    password: 'password12',
    ...overrides,
  };
}
