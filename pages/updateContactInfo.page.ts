import { Page } from '@playwright/test';
// 👇 Importing all locators from external JSON file
import * as updateContactInfoLoc from '../locators/updateContactInfo.json';

export class UpdateContactInfoPage {

    constructor(private page: Page) {
        console.info('📄 UpdateContactInfoPage initialized');
    }

    async updateContact() {

        console.info('🧭 Navigating to Update Contact Info page...');
        await this.page.click(updateContactInfoLoc.updateContactInfoBtn);
        await this.page.waitForLoadState('networkidle');

        console.info('✍️ Updating customer contact information...');

        // 🔹 Correct test data (Realistic Sample Values)
        await this.page.fill(updateContactInfoLoc.custFirstNameField, 'John');
        await this.page.fill(updateContactInfoLoc.custLastNameField, 'Doe');
        await this.page.fill(updateContactInfoLoc.custAddressField, '456 New St');
        await this.page.fill(updateContactInfoLoc.custCityField, 'Newtown');
        await this.page.fill(updateContactInfoLoc.custStateField, 'NY');
        await this.page.fill(updateContactInfoLoc.custZipcodeField, '67890');
        await this.page.fill(updateContactInfoLoc.custPhoneField, '555-6789');

        console.info('💾 Saving updated profile details...');
        await this.page.click(updateContactInfoLoc.updateProfileBtn);
        await this.page.waitForLoadState('networkidle');

        console.info('⏳ Waiting for profile update confirmation...');
        await this.page.waitForSelector(updateContactInfoLoc.profileUpdateConfirmation);

        const confirmText =
            (await this.page.locator(updateContactInfoLoc.profileUpdateConfirmation).textContent())?.trim() ?? '';

        const expectedText = 'Profile Updated';

        console.info(`🔍 Confirmation message received: "${confirmText}"`);

        // 🔹 Validate confirmation message
        if (confirmText.includes(expectedText)) {
            console.info('✅ Profile update confirmation message validated successfully.');
        } else {
            console.error('❌ Profile update confirmation message validation failed.');
            throw new Error(
                `Expected confirmation to contain "${expectedText}" but got:\n"${confirmText}"`
            );
        }

        console.info('🎉 Contact information updated successfully.');
    }
}
