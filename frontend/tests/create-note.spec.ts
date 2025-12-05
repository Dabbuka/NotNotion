import { test, expect } from '@playwright/test';

test('login, create note, write message, save note', async ({ page }) => {
  const unique = Date.now();
  const email = `e2e+${unique}@example.com`;
  const password = 'P4ssword!';
  const noteTitle = `E2E Note ${unique}`;
  const noteContent = `This is a test note created by Playwright on ${unique}.`;

  // Navigate to landing page first
  await page.goto('/');

  // Create an account
  await page.click('button:has-text("Get Started")');
  await page.waitForURL('/register');
  await page.fill('input[name="username"]', `user${unique}`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("Register")');
  await page.waitForURL('/home');

  // Create a note
  await page.click('button:has-text("+ New Document")');
  await page.fill('input[class="new-note-input"]', noteTitle);
  await page.click('button:has-text("Create")');
  await page.waitForURL(/\/app/);

  // Write message and save note
  await page.locator('.editor-content').click();
  await page.keyboard.type(noteContent);
  await page.click('button:has-text("Save Document")');

  // Go back to home page
  await page.click('nav a:has-text("Home")');
  await page.waitForURL('/home');
  await expect(page.locator(`text=${noteTitle}`)).toBeVisible();
});