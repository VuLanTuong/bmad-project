import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 * Set PLAYWRIGHT_NO_WEB_SERVER=1 when Spring Boot is already running (JDK 21: `.\mvnw.cmd spring-boot:run`).
 */
const noWebServer = !!process.env.PLAYWRIGHT_NO_WEB_SERVER;

export default defineConfig({
  testDir: './tests',
  /* Shared in-memory DB: keep one worker unless tests use fully isolated data. */
  workers: 1,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:8080',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Requires JDK 21 (matches pom.xml). Reuse existing server when developing locally. */
  ...(noWebServer
    ? {}
    : {
        webServer: {
          command:
            process.platform === 'win32'
              ? 'powershell -NoProfile -ExecutionPolicy Bypass -File .\\scripts\\run-springboot-portable-java21.ps1'
              : './mvnw spring-boot:run',
          cwd: __dirname,
          url: process.env.BASE_URL ?? 'http://localhost:8080',
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }),
});
