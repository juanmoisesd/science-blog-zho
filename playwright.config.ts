import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './verification',
  timeout: 60000,
  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
