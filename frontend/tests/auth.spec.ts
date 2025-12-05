import { test, expect } from '@playwright/test';

test('register, logout, and login', async ({ page }) => {
  const unique = Date.now();
  const email = `e2e+${unique}@example.com`;
  const password = 'P4ssword!';

  // Go to registration page (adjust route if different)
  await page.goto('/register');
  await page.fill('input[name="username"]', `user${unique}`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("Register")');


  // Ensure we're on the Home/Notes page
  await expect(page).toHaveURL(/(home|notes|\/)$/i);
  await expect(page.locator(`text=user${unique}`)).toBeVisible();

  // Logout and login again
  await page.click('button:has-text("Logout")');
  await page.waitForURL('/');
  await page.click('a:has-text("Login")');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("Sign In")');

  // Verify note appears in list
  await expect(page.locator(`text=user${unique}`)).toBeVisible();

});

