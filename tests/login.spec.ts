import { test } from "@playwright/test";
import UserLoginOnPrem from "../pages/loginPage.page";

test("User can login with valid credentials", async ({ page }) => {
  const login = new UserLoginOnPrem(page);

  await login.navigateToURL();
  await login.userLogin();
  
});
