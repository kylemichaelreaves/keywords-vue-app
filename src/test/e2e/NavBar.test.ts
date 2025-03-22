import {test, expect} from '@test/e2e/fixtures/PageFixture';

// test.use({
//     storageState: 'playwright/.auth/storageState.json'
// })


test.beforeEach(async ({page}) => {
    await page.goto('/budget-visualizer');
})

test('the NavBar is visible', async ({page}) => {
    const navBar = page.locator('.el-tabs').first();
    await expect(navBar).toBeVisible();
})

test.describe('NavBar loads the Budget Visualizer tab', () => {
    test('the Budget Visualizer tab is visible', async ({page}) => {
        const navBar = page.locator('.el-tabs');
        const budgetVisualizerTab = navBar.getByRole('tab', {name: 'budget-visualizer'});
        await expect(budgetVisualizerTab).toBeVisible();
    })

    test('the Budget Visualizer tab is clickable and its components are visible after clicking', async ({page}) => {
        const navBar = page.locator('.el-tabs');
        const budgetVisualizerTab = navBar.getByRole('tab', {name: 'budget-visualizer'});
        await budgetVisualizerTab.click();

        await expect(page.getByRole('heading', {name: 'Budget Visualizer'})).toBeVisible();
        await expect(page.getByRole('menubar')).toBeVisible();
        await expect(page.locator('div').filter({hasText: 'Budget Visualizer Add New'}).nth(3)).toBeVisible();
        await expect(page.getByRole('button', {name: 'Add New Transaction'})).toBeVisible();
        await expect(page.getByRole('link').first()).toBeVisible();
        await expect(page.getByRole('link').nth(1)).toBeVisible();
        await expect(page.getByRole('link').nth(2)).toBeVisible();
    })
})



