import {test, expect} from '@playwright/test';

const LOCAL_URL = 'http://localhost:5173';

test('has title', async ({page}) => {
    await page.goto(LOCAL_URL);

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle("Vite + Vue + TS");
});

test.skip('can go to the budget-visualizer tab', async ({page}) => {
    await page.goto(LOCAL_URL);

    // Click the get started link.
    await page.getByRole('tab', {name: 'budget-visualizer'}).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', {name: 'Budget Visualizer'})).toBeVisible();

    // the Add New Transaction button should be visible
    await expect(page.getByRole('button', {name: 'Add New Transaction'})).toBeVisible();
});


test('the Home page displays all of the relevant text', async ({page}) => {
    await page.goto(`${LOCAL_URL}/budget-visualizer`);
    await page.getByRole('link').first().click();
    await page.getByText('home', {exact: true}).click();
    await expect(page.getByText('budget-visualizer')).toBeVisible();
    await expect(page.getByRole('heading')).toContainText('Home');
    await expect(page.locator('body')).toContainText('In this demonstration of immense innovation and skill…');
    await expect(page.locator('body')).toContainText('I will be sketching out extremely sophisticated and mesmerizing UIs for my Lambdas and what they return.');
    await expect(page.locator('body')).toContainText('BudgetVisualizer will only work for me, since it is pulling records from a database behind a VPC');
    await expect(page.locator('body')).toContainText('AddressGeocoder won\'t work either; I doubt I set it up to take public requests');
    await expect(page.locator('body')).toContainText('Keywords I never started…I moved onto other things');
});

