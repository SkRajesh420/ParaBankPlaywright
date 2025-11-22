// tests/find-transactions.spec.ts
import { test } from '@playwright/test';
import { FindTransactionsPage } from '../../pages/findTransactions.page';
// If you have auth flow utility:
import { ensureLoggedIn } from '../../utils/authflow';

test('Find Transactions by date, date range and amount', async ({ page }) => {
    // 1. Login step (if required)
    await test.step('Login to application', async () => {
        await ensureLoggedIn(page);
    });

    const findTransactionsPage = new FindTransactionsPage(page);

    // 2. Find by single date
    await test.step('Find transactions by DATE', async () => {
        await findTransactionsPage.findTransactions('date', '11-20-2025',);
    });

    // 3. Find by date range
    await test.step('Find transactions by DATE RANGE', async () => {
        await findTransactionsPage.findTransactions('range','11-20-2025', '11-22-2025',);
    });

    // 4. Find by amount
    await test.step('Find transactions by AMOUNT', async () => {
        await findTransactionsPage.findTransactions('amount','100',);
    });
});
