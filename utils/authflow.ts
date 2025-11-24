// flows/authFlow.ts
import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.page';
import { RegistrationPage } from '../pages/registartion.page';
import {
  loadCredentials,
  saveCredentials,
  loadRegistrationData,
} from '../utils/testDataUtil';
import { format } from 'date-fns';

interface Credentials {
  username: string;
  password: string;
}

export async function ensureLoggedIn(page: Page): Promise<Credentials> {
  console.info('🔐 Starting ensureLoggedIn flow');

  // Only registration data is needed now, locators are handled inside Page Objects
  const registrationData = loadRegistrationData();

  const loginPage = new LoginPage(page);
  const registrationPage = new RegistrationPage(page, {});

  // --- Internal helper: register a new user ---
  async function registerNewUser(): Promise<Credentials> {
    const username = `user_${format(new Date(), 'ddMMyyHHmmss')}`;
    const password = registrationData.password;

    console.info(`Navigating to registration form for new user: ${username}`);
    await page.goto('/parabank/register.htm');

    console.info('Filling registration form');
    await registrationPage.register({
      ...registrationData,
      username,
      password,
      confirmPassword: password,
    });

    saveCredentials(username, password);
    console.log(`✅ Registered user: ${username}`);

    console.info('Verifying welcome message after registration');
    // await expect(
    //   page.getByRole('heading', { name: `Welcome ${username}` }),
    // ).toBeVisible();

    return { username, password };
  }

  // --- Main flow: use existing creds, or register if needed ---
  let creds = loadCredentials() as Credentials | null;
  let finalUsername: string;
  let finalPassword: string;

  await page.goto('/parabank/index.htm');

  if (!creds) {
    console.log('No existing credentials found, registering new user...');
    const newUser = await registerNewUser();
    finalUsername = newUser.username;
    finalPassword = newUser.password;
  } else {
    console.info(
      `Existing credentials found: ${creds.username}, attempting login`,
    );
    await loginPage.login(creds.username, creds.password);
    finalUsername = creds.username;
    finalPassword = creds.password;

    const loginError = page.locator(
      "//p[text()='The username and password could not be verified.']",
    );

    if (await loginError.isVisible()) {
      console.info('⚠ Credentials invalid, registering new user...');
      const newUser = await registerNewUser();
      finalUsername = newUser.username;
      finalPassword = newUser.password;
      creds = newUser;
    } else {
      console.info('Login successful with existing credentials');
    }
  }

  console.info(
    'Final assertion: Checking if Accounts Overview link is visible',
  );
  await expect(
    page.getByRole('link', { name: 'Accounts Overview' }),
  ).toBeVisible();

  console.log(`✅ Successfully logged in as: ${finalUsername}`);

  return { username: finalUsername, password: finalPassword };
}
