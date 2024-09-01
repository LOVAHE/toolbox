import { test, expect } from '@playwright/test';

test.describe('Tool - Websocket tester', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/websocket-tester');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Websocket tester - IT Tools');
  });

  test('', async ({ page }) => {

  });
});