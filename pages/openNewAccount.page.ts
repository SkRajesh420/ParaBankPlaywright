import { Page } from '@playwright/test';
import * as openNewAccountLoc from '../locators/openNewAccountLocators.json';

// Optional: restrict to only valid account types
type AccountType = 'SAVINGS' | 'CHECKING';

export class OpenNewAccountPage {
  constructor(private page: Page) {
    console.info('OpenNewAccountPage initialized with locators');
  }

  /**
   * Opens a new account of the given type (SAVINGS / CHECKING).
   */
  async openNewAccount(accountType: AccountType) {
    console.info('🔁 Starting "Open New Account" flow');
    console.info(`👉 Clicking "Open New Account" menu/button`);
    await this.page.click(openNewAccountLoc.openNewAccountBtn);
    await this.page.waitForLoadState('networkidle');

    console.info(`✅ Selecting account type: ${accountType}`);
    await this.page.selectOption(openNewAccountLoc.accountType, accountType);

    console.info('👉 Clicking "Open New Account" confirm button');
    await this.page.click(openNewAccountLoc.openNewAccountCnfrmBtn);
    await this.page.waitForLoadState('networkidle');

    console.info('⏳ Waiting for new account confirmation message...');
    await this.page.waitForSelector(openNewAccountLoc.newAccountCnfrmMsg);

    const confirmText =
      (await this.page.locator(openNewAccountLoc.newAccountCnfrmMsg).textContent())?.trim() ?? '';

    const expectedText = 'Congratulations, your account is now open.';

    // ✅ Use "contains" because the page also includes the new account number
    if (confirmText.includes(expectedText)) {
      console.info('🎉 New account confirmation message is as expected.');
      console.info(`ℹ️ Full confirmation text: "${confirmText}"`);
    } else {
      // ❌ Detailed error to help debugging when test fails
      throw new Error(
        `Expected confirmation message to contain:\n` +
        `"${expectedText}"\n` +
        `but got:\n` +
        `"${confirmText}"`
      );
    }
  }
}
