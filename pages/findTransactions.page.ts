import { Page } from '@playwright/test';
import * as findTransactionsLoc from '../locators/findTransactionsLocators.json';

export class FindTransactionsPage {

    constructor(private page: Page) {
        console.info('FindTransactionsPage initialized');
    }

    async findTransactions(type: 'date' | 'range' | 'amount', value1: string, value2?: string) {

        console.info(`=== FIND TRANSACTIONS START (${type.toUpperCase()}) ===`);

        // Open Find Transactions
        await this.page.click(findTransactionsLoc.findTransactionsBtn);
        await this.page.waitForLoadState('networkidle');

        // ----- SWITCH -----
        switch (type) {

            case 'date':
                console.info(`Searching by DATE: ${value1}`);
                await this.page.fill(findTransactionsLoc.findByDateField, value1);
                await this.page.click(findTransactionsLoc.findByDateSearchBtn);
                await this.page.waitForLoadState('domcontentloaded');
                break;

            case 'range':
                console.info(`Searching by DATE RANGE: ${value1} to ${value2}`);
                await this.page.fill(findTransactionsLoc.findByDateFromField, value1);
                await this.page.fill(findTransactionsLoc.findByDateToField, value2!);
                await this.page.click(findTransactionsLoc.findByDateRangeSearchBtn);
                await this.page.waitForLoadState('domcontentloaded');
                break;

            case 'amount':
                console.info(`Searching by AMOUNT: ${value1}`);
                await this.page.fill(findTransactionsLoc.findByAmountField, value1);
                await this.page.click(findTransactionsLoc.findByAmountSearchBtn);
                await this.page.waitForLoadState('domcontentloaded');
                break;

            default:
                throw new Error(`Invalid search type: ${type}`);
        }

        // ================================
        // 1️⃣ MUST CHECK: TransactionResultsTable
        // ================================

        const tableVisible = await this.page.locator(findTransactionsLoc.TransactionResultsTable).waitFor({ timeout: 2000 }).then(() => true).catch(() => false);

        if (!tableVisible) {
            throw new Error("❌ ERROR: TransactionResultsTable is NOT visible. Search failed.");
        }

        console.info("✅ TransactionResultsTable is visible.");

        // ================================
        // 2️⃣ OPTIONAL CHECK: TransactionResultData
        // ================================
        const rowVisible = await this.page.locator(findTransactionsLoc.TransactionResultData).isVisible();

        if (!rowVisible) {
            console.warn("⚠ WARNING: No rows found (TransactionResultData is NOT visible). Skipping details.");
            console.info(`=== FIND TRANSACTIONS END (${type.toUpperCase()}) ===`);
            return;
        }

        console.info("Row found. Opening Transaction Details...");

        // Click the row
        await this.page.click(findTransactionsLoc.TransactionResultData);

        // ================================
        // 3️⃣ Extract Transaction Details
        // ================================
        console.info('Reading Transaction Details...');

        const tds = this.page.locator(findTransactionsLoc.TransactionResultdatas);      
        const allText = await tds.allTextContents();

        let record: Record<string, string> = {};
        for (let i = 0; i < allText.length; i += 2) {
            const key = allText[i].trim().replace(/:$/, '');
            const value = allText[i + 1]?.trim() || "";
            record[key] = value;
        }

        console.info("===== Transaction Details =====");
        for (const [key, value] of Object.entries(record)) {
            console.info(`${key}: ${value}`);
        }
        console.info("================================");

        console.info(`=== FIND TRANSACTIONS END (${type.toUpperCase()}) ===`);
    }
}
