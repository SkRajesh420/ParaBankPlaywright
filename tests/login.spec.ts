import { test, expect } from "@playwright/test";
import UserLoginOnPrem from "../pages/loginPage.page";

// Group tests with tags for Jenkins pipeline TEST_LEVEL parameter
test.describe('@smoke Login Tests', () => {
  test("User can login with valid credentials", async ({ page }) => {
    const login = new UserLoginOnPrem(page);
    
    await login.navigateToURL();
    await login.userLogin();
    
    // Add assertion to verify login success
    // Example: await expect(page).toHaveURL(/dashboard/);
    // Or: await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
  });

  test("User should see login page elements", async ({ page }) => {
    const login = new UserLoginOnPrem(page);
    
    await login.navigateToURL();
    
    // Verify login form elements are present
    // Example assertions:
    // await expect(page.locator('#username')).toBeVisible();
    // await expect(page.locator('#password')).toBeVisible();
    // await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});



// You can also add individual tagged tests outside of describe blocks
test('@smoke Quick login verification', async ({ page }) => {
  const login = new UserLoginOnPrem(page);
  
  await login.navigateToURL();
  await login.userLogin();
  
  // Quick verification that login worked
  // await expect(page.url()).not.toContain('/login');
});