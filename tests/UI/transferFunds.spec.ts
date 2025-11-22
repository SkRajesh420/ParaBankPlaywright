// tests/transferFunds/transferFunds.spec.ts
import { test } from '@playwright/test';
import { TransferFundsPage } from '../../pages/transferFunds.page';
import { ensureLoggedIn } from '../../utils/authflow';

test('Transfer funds between accounts successfully', async ({ page }) => {

    await test.step('Login to the application', async () => {
        console.info('[Test] Starting login process...');
        const creds = await ensureLoggedIn(page);
        console.info(`[Test] ✅ Login successful. User: ${creds.username}`);
    });

    const transferFundsPage = new TransferFundsPage(page);

    await test.step('Initiate transfer funds flow', async () => {
        console.info('[Test] Navigating to Transfer Funds section...');
        await transferFundsPage.transferFunds('100');
        console.info('[Test] ✅ Transfer funds operation completed successfully.');
    });

    await test.step('End of Transfer Funds Test', async () => {
        console.info('[Test] 🎉 Transfer Funds test finished without errors.');
    });

});
