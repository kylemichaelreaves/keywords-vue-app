// import {test, expect} from '@playwright/test';
import {test, expect} from '@test/e2e/fixtures/PageFixture';
import {TransactionsPage} from "@test/e2e/pages/TransactionsPage";
import {transactionsMock} from "@mocks/transaction";

test('clicking the Transactions icon on the menu NavBar opens the TransactionsTable', async ({page}) => {
    await page.route('**/transactions/get-transactions?*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(transactionsMock),
        });
    });

    const transactionsPage = new TransactionsPage(page);

    await transactionsPage.goto();

    await expect(transactionsPage.daySelect).toBeVisible();
    await expect(transactionsPage.weekSelect).toBeVisible();
    await expect(transactionsPage.monthSelect).toBeVisible();
    await expect(transactionsPage.yearSelect).toBeVisible();

});
