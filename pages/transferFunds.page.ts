// pages/transferFunds.page.ts
import { Page } from '@playwright/test';
// 👇 This pulls locators directly from JSON
import * as transferFundsLoc from '../locators/transferFundsLocators.json';

/**
 * Page Object for the "Transfer Funds" feature.
 */
export class TransferFundsPage {

    constructor(private readonly page: Page) {
        console.info('[TransferFundsPage] Initialized with locators from transferFundsLocators.json');
    }

    /**
     * Performs a funds transfer and validates the success message.
     * @param transferAmount Amount to transfer as string (e.g. "500")
     */
    async transferFunds(transferAmount: string): Promise<void> {
        console.info('[TransferFunds] Transfer flow started');

        // Click on "Transfer Funds" main menu/button
        console.info('[TransferFunds] Clicking Transfer Funds button');
        await this.page.click(transferFundsLoc.transferFundsBtn);

        // Enter transfer amount
        console.info(`[TransferFunds] Filling transfer amount: ${transferAmount}`);
        await this.page.fill(transferFundsLoc.transferamountField, transferAmount);

        // Click on confirm/submit button
        console.info('[TransferFunds] Clicking Transfer Confirm button');
        await this.page.click(transferFundsLoc.transferConfirmButton);

        // Wait for page/DOM to settle so confirmation message can appear
        console.info('[TransferFunds] Waiting for page to be loaded (domcontentloaded)');
        await this.page.waitForLoadState('domcontentloaded');

        // Wait specifically for the confirmation message locator
        console.info('[TransferFunds] Waiting for confirmation message locator');
        await this.page.waitForSelector(transferFundsLoc.transferConfirmMsg);

        // Read and trim the confirmation text
        const confirmText =
            (await this.page.locator(transferFundsLoc.transferConfirmMsg).textContent())?.trim() ?? '';
        const expectedText = 'Transfer Complete!';

        console.info(`[TransferFunds] Confirmation text received: "${confirmText}"`);
        console.info(`[TransferFunds] Expected text to contain: "${expectedText}"`);

        // ✅ Validate that the confirmation contains the expected message
        if (confirmText.includes(expectedText)) {
            console.info('[TransferFunds] ✅ Transfer confirmation message matches expected text.');
        } else {
            console.error('[TransferFunds] ❌ Transfer confirmation message does NOT match expected text.');
            throw new Error(
                `Expected confirmation to contain "${expectedText}" but got:\n"${confirmText}"`
            );
        }

        console.info('[TransferFunds] Transfer flow completed');
    }
}
