import { Page } from '@playwright/test';

export class LoginPage {
  private locators: any; // Store the loaded locators

  constructor(private page: Page, locators: any) {
    this.locators = locators; // Assign locators passed from the test file
  }

  async login(username: string, password: string) {
    // Use locators from the JSON file
    await this.page.fill(this.locators.userNameField, username);
    await this.page.fill(this.locators.passwordField, password);
    await this.page.locator(this.locators.loginButton).click(); // Use locator instead of getByRole for consistency with XPath
    await this.page.waitForLoadState('networkidle'); // Ensure page has loaded after login attempt
  }
}