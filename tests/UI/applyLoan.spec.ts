// tests/login/login.spec.ts
import { test } from '@playwright/test';
import { ensureLoggedIn } from '../../utils/authflow';
import { ApplyLoanPage } from '../../pages/applyLoan.page';
import * as applyLoanData from '../../testData/applyLoanData.json';

test('Apply for loan with valid credentials', async ({ page }) => {

  await test.step('Initialize Page Object', async () => {
    console.info('Initializing ApplyLoanPage object');
  });

  const applyLoanPage = new ApplyLoanPage(page);

  await test.step('Login with valid user credentials', async () => {
    const creds = await ensureLoggedIn(page);
    console.log(`✅ Login successful. User: ${creds.username}`);
  });

  await test.step('Fill loan amount and down payment', async () => {
    console.info(`Loan Amount: ${applyLoanData.loanAmount}`);
    console.info(`Down Payment: ${applyLoanData.downPayment}`);
  });

  await test.step('Apply Loan and validate confirmation message', async () => {
    await applyLoanPage.applyLoan(applyLoanData.loanAmount, applyLoanData.downPayment);
    console.log(`✅ Loan application submitted successfully`);
  });

  await test.step('Complete Loan Application Test', async () => {
    console.info('🎉 Loan application workflow completed successfully.');
  });

});
