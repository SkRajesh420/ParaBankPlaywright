import { Page } from '@playwright/test';
// 👇 This pulls locators directly from JSON
import  * as loginLocators from '../locators/loginPageLocators.json';

export class LoginPage {
  // JSON object from file

  constructor(private page: Page) {
    console.info('LoginPage initialized with locators from loginLocators.json');
  }

  async login(username: string, password: string) {
    console.info('Login started');

    console.info(`Filling username: ${username}`);
    await this.page.fill(loginLocators.userNameField, username);

    console.info(`Filling password: ${'*'.repeat(password.length)}`);
    await this.page.fill(loginLocators.passwordField, password);

    console.info('Clicking login button');
    await this.page.locator(loginLocators.loginButton).click();

    console.info('Waiting for page to load after login');
    await this.page.waitForLoadState('networkidle');

    console.info('Login action completed, waiting for verification');
  }
}
