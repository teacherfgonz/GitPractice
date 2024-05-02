import { test, expect, type Page } from '@playwright/test';

const checkbox1 = (page: Page) => page.getByRole('checkbox').nth(0);
const checkbox2 = (page: Page) => page.getByRole('checkbox').nth(1);

const testCases = {
  checked: {
    checked: true,
  },
  unchecked: {
    checked: false,
  },
};

test.describe('Test Checkboxes', { tag: '@Regression' }, () => {
  for (const state of Object.keys(testCases)) {
    test(`Test Checkboxes all ${state}`, async ({ page }) => {
      await test.step('Go to the Checkboxes page', async () => {
        await page.goto('/');
        await page.getByRole('link', { name: 'Checkboxes' }).click();
      });

      await test.step('Set checkbox 1', async () => {
        await checkbox1(page).setChecked(testCases[state]['checked']);
      });

      await test.step('Set checkbox 2', async () => {
        await checkbox2(page).setChecked(testCases[state]['checked']);
      });

      await expect
        .soft(checkbox1(page), `Verified checkbox 1 is ${state}`)
        .toBeChecked({ checked: testCases[state]['checked'] });
      await expect
        .soft(checkbox2(page), `Verified checkbox 2 is ${state}`)
        .toBeChecked({ checked: testCases[state]['checked'] });
    });
  }
});
