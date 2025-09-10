import { Page, expect } from "@playwright/test";
import loginLoc from "../locators/loginPageLocators.json";
import loginData from "../utils/testData/loginData.json";
import logger from "../utils/logger";

export default class UserLoginOnPrem {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToURL() {
    await this.page.goto(loginData.paraBankURL, { waitUntil: 'networkidle' });
    logger.info("User navigated to ParaBank application");
  }

  async userLogin() {
    // Fill username
    await this.page.locator(loginLoc.userNameField).fill(loginData.userName);

    // Fill password
    await this.page.locator(loginLoc.passwordField).fill(loginData.password);

    // Click login
    await this.page.locator(loginLoc.loginButton).click();

    logger.info("User logged into ParaBank application");
    await this.page.waitForTimeout(5000);
  }
}
