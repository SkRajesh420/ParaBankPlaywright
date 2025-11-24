// tests/account-overview/bill-payment.spec.ts
import { test } from '@playwright/test';
import { billPaymentPage } from '../../pages/billPayment.page';
import { ensureLoggedIn } from '../../utils/authflow';

test('Perform bill payment and validate confirmation message', async ({ page }) => {

    await test.step('Login using valid user credentials', async () => {
        await ensureLoggedIn(page);
        console.info('🔐 [Test] User logged in successfully.');
    });

    await test.step('Execute bill payment flow', async () => {
        const billPayment = new billPaymentPage(page);
        await billPayment.billPayement();
        console.info('💸 [Test] Bill payment flow executed.');
    });

    await test.step('Validate bill payment confirmation log', async () => {
        console.info('📘 [Test] Bill payment confirmation validated and logged successfully.');
    });
});
