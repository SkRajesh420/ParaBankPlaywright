import { Page } from '@playwright/test';
import * as accountOverviewLoc from '../locators/accountOverviewLocators.json';

export class AccountOverviewPage {

    constructor(private page: Page) {
        console.info('Account Overview initialized');
    }

    async viewTransactionDetails(): Promise<void> {
        console.info('=== ACCOUNT OVERVIEW – TRANSACTION DETAILS START ===');

        // 1️⃣ Navigate to Account Overview
        console.info('[AccountOverview] Clicking "Account Overview" button');
        await this.page.click(accountOverviewLoc.accountOverviewBtn);

        // 2️⃣ Open account number link
        console.info('[AccountOverview] Clicking on account number link');
        await this.page.click(accountOverviewLoc.accountNmberLink);

        // 3️⃣ Read <td> cells
        console.info('[AccountOverview] Collecting <td> elements from transaction details section');
        const tds = this.page.locator(accountOverviewLoc.accountData);
        const allText = await tds.allTextContents();
        console.info('[AccountOverview] Raw cell texts:', allText);

        console.info(`[AccountOverview] Found ${allText.length} cell values`);

        // 4️⃣ Convert into key-value pairs
        const record: Record<string, string> = {};

        for (let i = 0; i < allText.length; i += 2) {
            const rawKey = allText[i]
            const rawValue = allText[i + 1]

            const key = rawKey.replace(/:$/, "");
            const value = rawValue;

            record[key] = value;
        }

        // 5️⃣ Print nicely
        console.info('===== TRANSACTION DETAILS =====');
        for (const [key, value] of Object.entries(record)) {
            console.info(`${key}: ${value}`);
        }
        console.info('================================');
        console.info('=== ACCOUNT OVERVIEW – TRANSACTION DETAILS END ===');
    }
}
