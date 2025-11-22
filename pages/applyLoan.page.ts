import { Page } from '@playwright/test';
// 👇 This pulls locators directly from JSON
import * as applyLoanLoc from '../locators/applyLoan.Locators.json';

export class ApplyLoanPage {
    // JSON object from file
    //private locators: any = applyLoanLoc;

    constructor(private page: Page) {
        console.info('LoginPage initialized with locators from applyLoan.json');
    }

    async applyLoan(loanAmount: string, downPayment: string) {
        console.info('Loan application started');

        console.info(`Clicking request loan button`);
        await this.page.click(applyLoanLoc.requestLoanBtn);
        await this.page.waitForLoadState('networkidle');

        console.info(`Filling loan amount: ${loanAmount}`);
        await this.page.fill(applyLoanLoc.loanAmountField, loanAmount);

        console.info(`Filling down payment: ${downPayment}`);
        await this.page.fill(applyLoanLoc.downPaymentField, downPayment);

        console.info(`Clicking apply now button`);
        await this.page.click(applyLoanLoc.applyNowBtn);
        await this.page.waitForLoadState('networkidle');

        console.info(`Waiting for confirmation message`);
        await this.page.waitForSelector(applyLoanLoc.LoanCnfrmMsg);
        const confirmText = (await this.page.locator(applyLoanLoc.LoanCnfrmMsg).textContent())?.trim() ?? '';
        const expectedText = 'Congratulations, your loan has been approved.';

        // ✅ Updated with contains + else
        if (confirmText.includes(expectedText)) {
            console.info('Loan confirmation message matches expected text.');
            console.info(`Full confirmation text: ${confirmText}`);
        } else {
            throw new Error(
                `Expected confirmation to contain "${expectedText}" but got:\n"${confirmText}"`
            );
        }
    }
}


