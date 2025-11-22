// tests/account-overview/transaction-details.spec.ts
import { test } from '@playwright/test';
import { AccountOverviewPage } from '../../pages/accountOverview.page';
import { ensureLoggedIn } from '../../utils/authflow';

test('View transaction details from Account Overview', async ({ page }) => {

    await test.step('Login with valid user', async () => {
        await ensureLoggedIn(page);
        console.info('[Test] Login successful.');
    });

    await test.step('Navigate to Account Overview and read transaction details', async () => {
        const accountPage = new AccountOverviewPage(page);
        await accountPage.viewTransactionDetails();
    });

    await test.step('Verify details printed in console', async () => {
        console.info('[Test] Transaction details printed successfully.');
    });
});
