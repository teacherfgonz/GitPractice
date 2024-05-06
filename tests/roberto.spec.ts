import { test, expect, type Page } from '@playwright/test';

// --- LOCATORS ---
// Base locators
const pageLink = (page: Page, name: string) => page.getByRole('link', { name: name });
const pageButton = (page: Page, name: string) =>
  page.getByRole('button', { name: name });

// Checkboxes
const checkbox1 = (page: Page) => page.getByRole('checkbox').nth(0);
const checkbox2 = (page: Page) => page.getByRole('checkbox').nth(1);

// Drag and Drop
const firstElement = (page: Page) => page.locator('#column-a');
const secondElement = (page: Page) => page.locator('#column-b');

// Geolocation
const googleGeoData = (page: Page) => page.locator('.bwoZTb');

// --- TEST DATA ---
// Checkboxes
const testCheckboxesData = {
  checked: {
    checked: true,
  },
  unchecked: {
    checked: false,
  },
};

// Test Geolocation
const obelistoGeoData = {
  latitude: -34.603732,
  longitude: -58.382217,
};

// --- TEST CASES ---
for (const state of Object.keys(testCheckboxesData)) {
  test(
    `Test Checkboxes all ${state}`,
    {
      tag: '@Regression',
      annotation: {
        type: 'Info',
        description:
          'The page loads with the first checkbox unchecked and second checked',
      },
    },
    async ({ page }) => {
      await test.step('Go to the Checkboxes page', async () => {
        await page.goto('/');
        await pageLink(page, 'Checkboxes ').click();
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
    }
  );
}

test(
  'Test Drag and Drop',
  { annotation: { type: 'info', description: 'The page loads with A before B' } },
  async ({ page }) => {
    await test.step('Go to the Drag and Drop page', async () => {
      await page.goto('/');
      await pageLink(page, 'Drag and Drop').click();
    });

    await test.step('Move A to B', async () => {
      await firstElement(page)
        .filter({ hasText: 'A' })
        .dragTo(secondElement(page).filter({ hasText: 'B' }));
    });

    await expect
      .soft(firstElement(page), 'The first element have the B value')
      .toHaveText('B');
    await expect
      .soft(secondElement(page), 'The second element have the A value')
      .toHaveText('A');
  }
);

test(
  'Test Geolocation',
  {
    annotation: {
      type: 'info',
      description: 'The test uses the DD coordinates of the Atlas monument',
    },
  },
  async ({ page }) => {
    await page.context().setGeolocation({
      latitude: obelistoGeoData.latitude,
      longitude: obelistoGeoData.longitude,
    });
    await page.context().grantPermissions(['geolocation']);

    await test.step('Go to the Geolocation page', async () => {
      await page.goto('/');
      await pageLink(page, 'Geolocation').click();
    });

    await test.step('Click to get Geolocation', async () => {
      await pageButton(page, 'Where am I?').click();
      await pageLink(page, 'See it on Google').click();
    });

    await expect(googleGeoData(page)).toContainText(
      `${obelistoGeoData.latitude}, ${obelistoGeoData.longitude}`
    );
  }
);
