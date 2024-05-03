import test, { Page, expect } from '@playwright/test';

const addElementButton = (page: Page) =>
  page.getByRole('button', { name: 'Add Element' });
const deleteButton = (page: Page) => page.getByRole('button', { name: 'Delete' });

const testElementsToAdd = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
    for (const clicks of testElementsToAdd) {
      test(`Adding and removing ${clicks} ${
        clicks > 1 ? 'elements' : 'element'
      }`, async ({ page }) => {
        await test.step('Go to the Add/Remove Elements page', async () => {
          await page.goto('/');
          await page.getByRole('link', { name: 'Add/Remove Elements' }).click();
        });

        await expect
          .soft(addElementButton(page), 'Add element button is visible')
          .toBeVisible();
        await expect
          .soft(deleteButton(page), 'Delete button does not exist')
          .toBeHidden();

        await test.step(`Clicking to add element button ${clicks} ${
          clicks > 1 ? 'times' : 'time'
        }`, async () => {
          await addElementButton(page).click({
            clickCount: clicks,
          });
        });

        const elementsAddedCount = (await deleteButton(page).allInnerTexts()).length;
        await expect
          .soft(deleteButton(page).nth(0), 'There is an element in first position')
          .toBeVisible();
        await expect
          .soft(
            elementsAddedCount,
            `There is a total of ${clicks} ${clicks > 1 ? 'elements' : 'element'}`
          )
          .toBeLessThanOrEqual(clicks);

        await test.step(`Delete ${clicks} ${
          clicks > 1 ? 'elements' : 'element'
        } added`, async () => {
          await deleteButton(page).nth(0).click({ clickCount: clicks });
        });
        const elementsDeletedCount = (await deleteButton(page).allInnerTexts()).length;
        await expect
          .soft(deleteButton(page), 'Elements have been deleted assertion 1')
          .toBeHidden();
        await expect
          .soft(elementsDeletedCount, 'Elements have been deleted assertion 2')
          .toBeLessThanOrEqual(0);
      });
    }
  }
);
