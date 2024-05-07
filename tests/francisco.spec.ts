import test, { Page, expect } from '@playwright/test';

const addElementButton = (page: Page) =>
  page.getByRole('button', { name: 'Add Element' });
const deleteButton = (page: Page) => page.getByRole('button', { name: 'Delete' });

const testCasesAddRemove = {
  'Delete button does not exist': {
    add: 5,
    remove: 5,
  },
  '5 remaining': {
    add: 10,
    remove: 5,
  },
  'Adding 20': {
    add: 20,
    remove: 0,
  },
};

test.describe(
  'Test Add Remove Elements',
  {
    tag: '@Regresion',
    annotation: {
      type: 'Info',
      description: 'The page loads with an add element button and no elements added.',
    },
  },
  () => {
    for (const testCase of Object.keys(testCasesAddRemove)) {
      test(testCase, async ({ page }) => {
        await test.step('Go to the Add/Remove Elements page', async () => {
          await page.goto('/');
          await page.getByRole('link', { name: 'Add/Remove Elements' }).click();
        });

        await test.step(`Clicking to add element button ${testCasesAddRemove[testCase].add} times`, async () => {
          await addElementButton(page).click({
            clickCount: testCasesAddRemove[testCase].add,
          });
        });

        await test.step(`Delete ${testCasesAddRemove[testCase].remove} added elements`, async () => {
          await deleteButton(page)
            .nth(0)
            .click({ clickCount: testCasesAddRemove[testCase].remove });
        });

        if (testCase === 'Delete button does not exist') {
          await expect
            .soft(deleteButton(page), 'Delete button does not exist')
            .toBeHidden();
        }

        if (testCase === '5 Remaining') {
          await expect
            .soft(deleteButton(page), '5 delete elemennts remaining')
            .toHaveCount(5);
        }

        if (testCase === 'Adding 20') {
          await expect
            .soft(deleteButton(page), '5 delete elemennts remaining')
            .toHaveCount(20);
        }
      });
    }
  }
);
