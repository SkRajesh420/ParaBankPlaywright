import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.page';
import { RegistrationPage } from '../pages/registartion.page';
import { loadCredentials, saveCredentials, loadRegistrationData, loadLoginLocators, loadRegistrationLocators } from '../utils/testDataUtil';
import { format } from 'date-fns';

test.describe('Login Module Tests', () => {
  let loginPage: LoginPage;
  let registrationPage: RegistrationPage;
  let registrationData: any;
  let loginLocators: any;
  let registrationLocators: any;

  // Function to register a new user
  async function registerNewUser(page: Page) { // Pass page as argument
    const username = `user_${format(new Date(), 'ddMMyyHHmmss')}`;
    const password = registrationData.password;

    await page.goto('/parabank/register.htm'); // Navigate to registration form
    await registrationPage.register({
      ...registrationData,
      username,
      password,
      confirmPassword: password
    });

    saveCredentials(username, password);
    console.log(`✅ Registered user: ${username}`);
    // Expect the 'Welcome user_XXXX' message after successful registration
    await expect(page.getByRole('heading', { name: `Welcome ${username}` })).toBeVisible();
    return { username, password };
  }

  test.beforeAll(() => {
    loginLocators = loadLoginLocators();
    registrationLocators = loadRegistrationLocators();
    registrationData = loadRegistrationData();
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page, loginLocators);
    registrationPage = new RegistrationPage(page, registrationLocators);
    await page.goto('/parabank/index.htm'); // Start each test from the login page
  });

  test('Login with auto-registration if credentials invalid', async ({ page }) => {
    let creds = loadCredentials();
    let finalUsername: string; // To store the username of the user who is ultimately logged in

    if (!creds) {
      // Scenario 1: No credentials found, register a new user
      console.log('No existing credentials found, registering new user...');
      creds = await registerNewUser(page); // Pass page to the helper function
      finalUsername = creds.username; // This user is already logged in after registration
    } else {
      // Scenario 2: Credentials exist, attempt initial login
      await loginPage.login(creds.username, creds.password);
      finalUsername = creds.username; // Assume this user will be logged in

      // Check for login error
      const loginError = page.locator("//p[text()='The username and password could not be verified.']");
      if (await loginError.isVisible()) {
        // Scenario 3: Initial login failed, register a new user
        console.log('⚠ Credentials invalid, registering new user...');
        creds = await registerNewUser(page); // Pass page to the helper function
        finalUsername = creds.username; // This new user is now logged in
        // No need to call loginPage.login again as registerNewUser automatically logs in.
      }
    }

    // Final Assertion: Regardless of the path, we should end up on the "Accounts Overview" page
    // if the user is truly logged in and past the initial welcome screen (if any).
    // The previous assertions in registerNewUser ensure we see 'Welcome USER'
    // Now we expect to be on the 'Accounts Overview' for any path.
    await expect(page.getByRole('link', { name: 'Accounts Overview' })).toBeVisible();
    console.log(`✅ Successfully logged in as: ${finalUsername}`);
  });
});