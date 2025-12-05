import { test, expect } from '@playwright/test';

test('register', async ({ page }) => {
  const unique = Date.now();
  const email = `e2e+${unique}@example.com`;
  const password = 'P4ssword!';

  // Go to registration page (adjust route if different)
  await page.goto('/register');
  await page.fill('input[name="username"]', `user${unique}`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("Register")');

/*
  // After register redirect to login or auto-login
  // If redirect to login:P
  if (page.url().includes('/login')) {
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Login")');
  }

  // Ensure we're on the Home/Notes page
  await expect(page).toHaveURL(/(home|notes|\/)$/i);

  // Open note editor or click create
  await page.click('button:has-text("New Note")').catch(async () => {
    // fallback: navigate to note editor route
    await page.goto('/editor');
  });

  const title = `E2E Note ${unique}`;
  const content = 'This is a test note created by Playwright.';

  await page.fill('input[name="title"]', title);
  await page.fill('textarea[name="content"]', content);
  await page.click('button:has-text("Save")');

  // Verify note appears in list
  await expect(page.locator(`text=${title}`)).toBeVisible();
  await expect(page.locator(`text=${content}`)).toBeVisible();
*/
});

