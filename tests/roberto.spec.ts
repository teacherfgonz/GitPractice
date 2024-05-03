import { test, expect, type Page } from '@playwright/test';

const checkbox1 = (page: Page) => page.getByRole('checkbox').nth(0);
const checkbox2 = (page: Page) => page.getByRole('checkbox').nth(1);

const testCheckboxesData = {
  checked: {
    checked: true,
  },
  unchecked: {
    checked: false,
  },
};

test.describe(
  'Test Checkboxes',
  {
    tag: '@Regression',
    annotation: {
      type: 'Info',
      description:
        'The page loads with the first checkbox unchecked and second checked',
    },
  },
  () => {
    for (const state of Object.keys(testCheckboxesData)) {
      test(`Test Checkboxes all ${state}`, async ({ page }) => {
        await test.step('Go to the Checkboxes page', async () => {
          await page.goto('/');
          await page.getByRole('link', { name: 'Checkboxes' }).click();
        });

        await test.step('Set checkbox 1', async () => {
          await checkbox1(page).setChecked(testCheckboxesData[state]['checked']);
        });

        await test.step('Set checkbox 2', async () => {
          await checkbox2(page).setChecked(testCheckboxesData[state]['checked']);
        });

        await expect
          .soft(checkbox1(page), `Verified checkbox 1 is ${state}`)
          .toBeChecked({ checked: testCheckboxesData[state]['checked'] });
        await expect
          .soft(checkbox2(page), `Verified checkbox 2 is ${state}`)
          .toBeChecked({ checked: testCheckboxesData[state]['checked'] });
      });
    }
  }
);
