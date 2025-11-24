import { test, expect } from '@playwright/test'; // Added expect for potential assertions
import { RegistrationPage } from '../../pages/registartion.page';
import { saveCredentials, loadRegistrationData, loadRegistrationLocators } from '../../utils/testDataUtil';
import { format } from 'date-fns';

test.describe('Registration Module Tests', () => {
  let registrationPage: RegistrationPage;
  let registrationData: any;
  let registrationLocators: any;

  test.beforeAll(() => {
    console.info('Loading registration locators and test data');
    registrationLocators = loadRegistrationLocators();
    registrationData = loadRegistrationData();
  });

  test.beforeEach(async ({ page }) => {
    console.info('Initializing RegistrationPage object and navigating to login page');
    registrationPage = new RegistrationPage(page, registrationLocators);
    await page.goto('/parabank/index.htm');
  });

  test('Register new user', async ({ page }) => {
    console.info('Starting test: Register new user');

    const username = `user_${format(new Date(), 'ddMMyyHHmmss')}`;
    const password = registrationData.password;

    console.info(`Filling registration form for username: ${username}`);
    await registrationPage.register({
      ...registrationData,
      username,
      password,
      confirmPassword: password
    });

    saveCredentials(username, password);
    console.log(`✅ Registered user: ${username}`);

    console.log('✅ Registration test completed successfully');
  });
});
