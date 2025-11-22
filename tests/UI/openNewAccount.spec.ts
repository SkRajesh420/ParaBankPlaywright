// tests/login/openNewAccount.spec.ts
import { test } from '@playwright/test';
import { ensureLoggedIn } from '../../utils/authflow';
import { OpenNewAccountPage } from '../../pages/openNewAccount.page';

//
// 🔹 Test: Open a new SAVINGS account
//
test('Open a new Savings account with valid credentials', async ({ page }) => {

    // Initialize the Page Object
    const openNewAccountPage = new OpenNewAccountPage(page);

    // Ensure the user is logged in before performing the action
    const creds = await ensureLoggedIn(page);
    console.log(`🔐 User logged in successfully as: ${creds.username}`);

    // Perform the "Open New Savings Account" action
    console.log('📂 Attempting to open a NEW SAVINGS account...');
    await openNewAccountPage.openNewAccount('SAVINGS');

    console.log('🎉 SUCCESS: Savings account opened successfully.');
});


//
// 🔹 Test: Open a new CHECKING account
//
test('Open a new Checking account with valid credentials', async ({ page }) => {

    // Initialize the Page Object
    const openNewAccountPage = new OpenNewAccountPage(page);

    // Ensure the user is logged in before performing the action
    const creds = await ensureLoggedIn(page);
    console.log(`🔐 User logged in successfully as: ${creds.username}`);

    // Perform the "Open New Checking Account" action
    console.log('📂 Attempting to open a NEW CHECKING account...');
    await openNewAccountPage.openNewAccount('CHECKING');

    console.log('🎉 SUCCESS: Checking account opened successfully.');
});
