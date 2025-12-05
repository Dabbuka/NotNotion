import { test, expect } from '@playwright/test';

test('create note -> write message -> save note', async ({ page }) => {
  const unique = Date.now();
  const noteTitle = `E2E Note ${unique}`;
  const noteContent = `This is a test note created by Playwright on ${unique}.`;

  await page.goto('/home');
  await page.click('button:has-text("+ New Document")');
  await page.fill('input[class="new-note-input"]', noteTitle);
  await page.click('button:has-text("Create")');

})