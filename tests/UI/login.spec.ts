// tests/login/login.spec.ts (path as per your structure)
import { test } from '@playwright/test';
import { ensureLoggedIn } from '../../utils/authflow';

test.describe('Login Module Tests', () => {
  test('Login with auto-registration if credentials invalid', async ({ page }) => {
    const creds = await ensureLoggedIn(page);
    console.log(`✅ Login test completed. Logged in as: ${creds.username}`);
  });
});
