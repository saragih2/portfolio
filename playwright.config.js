// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',

  use: {
    // Alamat dasar. Bisa dialihkan ke preview Vercel lewat env BASE_URL.
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Kalau BASE_URL diisi, server lokal tidak dinyalakan.
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npx http-server -p 3000 -c-1 --silent .',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
