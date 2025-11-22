import { Page, Locator } from "@playwright/test";

export class BasePage {
    protected page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }
    
    async clickElement(locator: Locator): Promise<void> {
        await locator.click();
    }
    
    async fillText(locator: Locator, text: string): Promise<void> {
        await locator.fill(text);
    }
    
    async getElementText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }
    
    async isElementVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }
    
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }





    
}