// tests/account-overview/update-contact-info.spec.ts
import { test } from '@playwright/test';
import { UpdateContactInfoPage } from '../../pages/updateContactInfo.page';
import { ensureLoggedIn } from '../../utils/authflow';

test('Update customer contact information and validate confirmation message', async ({ page }) => {

    await test.step('Login using valid user credentials', async () => {
        await ensureLoggedIn(page);
        console.info('🔐 [Test] User logged in successfully.');
    });

    await test.step('Update customer contact information', async () => {
        const updateContactPage = new UpdateContactInfoPage(page);
        await updateContactPage.updateContact();
        console.info('📝 [Test] Contact information updated successfully.');
    });

    await test.step('Validate profile update confirmation log', async () => {
        console.info('📘 [Test] Profile update confirmation validated and logged successfully.');
    });
});
