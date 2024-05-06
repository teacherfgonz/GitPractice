import test, { Page, expect } from '@playwright/test';

const addElementButton = (page: Page) =>
  page.getByRole('button', { name: 'Add Element' });
const deleteButton = (page: Page) => page.getByRole('button', { name: 'Delete' });

const testCasesAddRemove = {
  'User adds elements and remove them all': {
    add: 20,
    remove: 20,
    firstToLast: true,
  },
  'User adds 10 elements and remove 5': {
    add: 10,
    remove: 5,
    firstToLast: true,
  },
  'User adds 50 elements and remove them all from last to first': {
    add: 50,
    remove: 50,
    firstToLast: false,
  },
  'User adds 30 elements and remove none': {
    add: 30,
    remove: 0,
    firstToLast: true,
  },
};

test.describe(
  'Add and Remove Elements',
  {
    tag: '@Regresion',
    annotation: {
      type: 'Info',
      description: 'The page loads with an add element button and no elements added.',
    },
  },
  () => {
    for (const testCases of Object.keys(testCasesAddRemove)) {
      test(testCases, async ({ page }) => {
        await test.step('Go to the Add/Remove Elements page', async () => {
          await page.goto('/');
          await page.getByRole('link', { name: 'Add/Remove Elements' }).click();
        });
        await test.step(`Clicking  add element button ${testCasesAddRemove[testCases].add} times`, async () => {
          await addElementButton(page).click({
            clickCount: testCasesAddRemove[testCases].add,
          });
        });

        await test.step(`Delete ${testCasesAddRemove[testCases].remove} added elements`, async () => {
          if (testCasesAddRemove[testCases].firstToLast) {
            await deleteButton(page)
              .nth(0)
              .click({ clickCount: testCasesAddRemove[testCases].remove });
          } else {
            for (let i = testCasesAddRemove[testCases].remove - 1; i > -1; i--) {
              await deleteButton(page).nth(i).click();
            }
          }
        });

        const deleteBtnNumber =
          testCasesAddRemove[testCases].add - testCasesAddRemove[testCases].remove;

        await expect
          .soft(deleteButton(page), `${deleteBtnNumber} delete element(s) remaining`)
          .toHaveCount(deleteBtnNumber);
      });
    }
  }
);
