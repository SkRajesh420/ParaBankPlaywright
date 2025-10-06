import { Page } from '@playwright/test';

export class RegistrationPage {
  private locators: any; // Store the loaded locators

  constructor(private page: Page, locators: any) {
    this.locators = locators; // Assign locators passed from the test file
  }

  async register(data: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    ssn: string;
    username: string;
    password: string;
    confirmPassword: string; // Added this field
  }) {
    await this.page.getByRole('link', { name: 'Register' }).click(); // This locator is generic, so can remain hardcoded or be added to JSON if preferred.
    await this.page.fill(this.locators.firstName, data.firstName);
    await this.page.fill(this.locators.lastName, data.lastName);
    await this.page.fill(this.locators.address, data.address);
    await this.page.fill(this.locators.city, data.city);
    await this.page.fill(this.locators.state, data.state);
    await this.page.fill(this.locators.zipCode, data.zipCode);
    await this.page.fill(this.locators.phoneNumber, data.phoneNumber);
    await this.page.fill(this.locators.ssn, data.ssn);
    await this.page.fill(this.locators.username, data.username);
    await this.page.fill(this.locators.password, data.password);
    await this.page.fill(this.locators.confirmPassword, data.confirmPassword); // Use locator for confirmPassword
    await this.page.getByRole('button', { name: 'Register' }).click();
  }
}