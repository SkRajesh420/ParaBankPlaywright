import { Page } from '@playwright/test';
// 👇 Importing all locators from external JSON file
import * as billPaymentLoc from '../locators/billPaymentLocators.json';

export class billPaymentPage {

    constructor(private page: Page) {
        console.info('📄 BillPaymentPage initialized');
    }

    async billPayement() {

        console.info('🧭 Navigating to Bill Payment section...');
        await this.page.click(billPaymentLoc.billPayBtn);
        await this.page.waitForLoadState('networkidle');

        console.info('✍️ Filling Payee Details...');
        await this.page.fill(billPaymentLoc.payeeNameField, 'John Doe');
        await this.page.fill(billPaymentLoc.payeeAdressField, '123 Main St');
        await this.page.fill(billPaymentLoc.payeeCityField, 'Anytown');
        await this.page.fill(billPaymentLoc.payeeStateField, 'CA');
        await this.page.fill(billPaymentLoc.payeeZipcodeField, '12345');
        await this.page.fill(billPaymentLoc.payeePhoneField, '555-1234');

        console.info('💳 Filling Account & Payment Details...');
        await this.page.fill(billPaymentLoc.payeeAccountField, '987654321');
        await this.page.fill(billPaymentLoc.payeeVerifyAccountField, '987654321');
        await this.page.fill(billPaymentLoc.payeeAmountField, '250.00');

        console.info('📨 Submitting Bill Payment...');
        await this.page.click(billPaymentLoc.sendPaymentBtn);
        await this.page.waitForLoadState('networkidle');

        console.info('⏳ Waiting for confirmation message...');
        await this.page.waitForSelector(billPaymentLoc.billPaymentConfirmation);

        const confirmText =
            (await this.page.locator(billPaymentLoc.billPaymentConfirmation).textContent())?.trim() ?? '';

        const expectedText = 'Bill Payment Complete';

        console.info(`🔍 Confirmation Text Received: "${confirmText}"`);

        // Validate message
        if (confirmText.includes(expectedText)) {
            console.info('✅ Bill payment confirmation message validated successfully.');
        } else {
            console.error('❌ Bill payment confirmation message validation failed.');
            throw new Error(
                `Expected confirmation to contain "${expectedText}" but got:\n"${confirmText}"`
            );
        }

        console.info('🎉 Bill payment process completed.');
    }
}
