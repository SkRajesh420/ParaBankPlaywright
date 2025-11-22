import { Page } from '@playwright/test';
import * as loginLocators from '../locators/userRegistration.json'

export class RegistrationPage {

  constructor(private page: Page, locators: any) {
    console.info('RegistrationPage initialized with locators');
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
    confirmPassword: string;
  }) {
    console.info('Starting registration process');

    console.info('Clicking Register link');
    await this.page.getByRole('link', { name: 'Register' }).click();

    console.info(`Filling First Name: ${data.firstName}`);
    await this.page.fill(loginLocators.firstName, data.firstName);

    console.info(`Filling Last Name: ${data.lastName}`);
    await this.page.fill(loginLocators.lastName, data.lastName);

    console.info(`Filling Address: ${data.address}`);
    await this.page.fill(loginLocators.address, data.address);

    console.info(`Filling City: ${data.city}`);
    await this.page.fill(loginLocators.city, data.city);

    console.info(`Filling State: ${data.state}`);
    await this.page.fill(loginLocators.state, data.state);

    console.info(`Filling Zip Code: ${data.zipCode}`);
    await this.page.fill(loginLocators.zipCode, data.zipCode);

    console.info(`Filling Phone Number: ${data.phoneNumber}`);
    await this.page.fill(loginLocators.phoneNumber, data.phoneNumber);

    console.info(`Filling SSN: ${data.ssn}`);
    await this.page.fill(loginLocators.ssn, data.ssn);

    console.info(`Filling Username: ${data.username}`);
    await this.page.fill(loginLocators.username, data.username);

    console.info(`Filling Password: ${'*'.repeat(data.password.length)}`);
    await this.page.fill(loginLocators.password, data.password);

    console.info(`Filling Confirm Password: ${'*'.repeat(data.confirmPassword.length)}`);
    await this.page.fill(loginLocators.confirmPassword, data.confirmPassword);

    console.info('Clicking Register button');
    await this.page.getByRole('button', { name: 'Register' }).click();

    console.info('Registration process completed');
  }
}
