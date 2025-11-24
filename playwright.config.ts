import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // Timeout settings
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  
  // NO parallel execution - tests run sequentially
  fullyParallel: false,
  workers: 1,
  
  // Retry settings
  retries: process.env.CI ? 2 : 0,
  
  // Multiple reporter types
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'always' }], // Opens automatically
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false 
    }],
    ['list'],
    ['dot']
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL
    baseURL: 'https://parabank.parasoft.com/parabank',
    
    // Collect trace on failure
    trace: 'on',
    
    // Screenshot on failure
    screenshot: 'on',
    
    // Video only on failure
    video: 'retain-on-failure',
    
    // Browser settings
    headless: false,
    
    // Viewport size
    viewport: { width: 1280, height: 720 },
    
    // Action timeout
    actionTimeout: 10000,
    
    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Configure projects for different browsers and devices
  projects: [
    // UI Tests - Desktop Browsers (Run FIRST)
    {
      name: 'UI - Chromium',
      testIgnore: '**/API/**',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },

    // {
    //   name: 'UI - Firefox',
    //   testIgnore: '**/API/**',
    //   use: { 
    //     ...devices['Desktop Firefox'] 
    //   },
    // },

    // {
    //   name: 'UI - WebKit',
    //   testIgnore: '**/API/**',
    //   use: { 
    //     ...devices['Desktop Safari'] 
    //   },
    // },

    // UI Tests - Mobile Devices
    // {
    //   name: 'UI - Mobile Chrome',
    //   testIgnore: '**/API/**',
    //   use: { 
    //     ...devices['Pixel 5'] 
    //   },
    // },

    // {
    //   name: 'UI - Mobile Safari',
    //   testIgnore: '**/API/**',
    //   use: { 
    //     ...devices['iPhone 13'] 
    //   },
    // },

    // {
    //   name: 'UI - iPad',
    //   testIgnore: '**/API/**',
    //   use: { 
    //     ...devices['iPad Pro'] 
    //   },
    // },

    // {
    //   name: 'UI - Galaxy S9+',
    //   testIgnore: '**/API/**',
    //   use: { 
    //     ...devices['Galaxy S9+'] 
    //   },
    // },

    // {
    //   name: 'UI - iPhone 12',
    //   testIgnore: '**/API/**',
    //   use: { 
    //     ...devices['iPhone 12'] 
    //   },
    // },

    // API Tests - Run LAST, only once, no multiple browsers/devices
    {
      name: 'API Tests',
      testMatch: '**/API/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome']
      },
    },
  ],

  // Output folder for test artifacts
  outputDir: 'test-results/',

  // Global setup - Clean allure results before tests
  globalSetup: './global-setup.ts',

  // Global teardown - Generate and open allure report after tests
  globalTeardown: './global-teardown.ts',

  
});