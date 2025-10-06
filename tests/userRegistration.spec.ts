import { test, expect } from '@playwright/test'; // Added expect for potential assertions
import { RegistrationPage } from '../pages/registartion.page';
import { saveCredentials, loadRegistrationData, loadRegistrationLocators } from '../utils/testDataUtil'; // Added new imports
import { format } from 'date-fns';

test.describe('Registration Module Tests', () => {
  let registrationPage: RegistrationPage;
  let registrationData: any;
  let registrationLocators: any;

  test.beforeAll(() => {
    registrationLocators = loadRegistrationLocators();
    registrationData = loadRegistrationData();
  });

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page, registrationLocators); // Pass locators to constructor
    await page.goto('/parabank/index.htm'); 
  });

  test('Register new user', async ({ page }) => {
    // Use data from registration.json, but override username dynamically
    const username = `user_${format(new Date(), 'ddMMyyHHmmss')}`;
    const password = registrationData.password; // Using password from JSON

    await registrationPage.register({
      ...registrationData, // Spread all properties from JSON
      username,
      password,
      confirmPassword: password // Ensure confirmPassword matches
    });

    saveCredentials(username, password);
    console.log(`✅ Registered user: ${username}`);

    // Optional: Add an assertion to confirm successful registration
    await expect(page.getByRole('heading', { name: 'Welcome user' })).toBeVisible();
  });
});