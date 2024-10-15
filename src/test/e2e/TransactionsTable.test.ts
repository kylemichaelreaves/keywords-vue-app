// import {test, expect} from '@playwright/test';
import {test, expect} from '@test/e2e/fixtures/PageFixture';
import {TransactionsPage} from "@test/e2e/pages/TransactionsPage";

test('clicking the Transactions icon on the menu NavBar opens the TransactionsTable', async ({page}) => {

    const transactionsPage = new TransactionsPage(page);


    await transactionsPage.goto();

    console.log('transactionsPage', transactionsPage);
    console.log('transactionsPage.transactionsTable', transactionsPage.transactionsTable);


    await expect(transactionsPage.daySelect).toBeVisible();
    await expect(transactionsPage.weekSelect).toBeVisible();
    await expect(transactionsPage.monthSelect).toBeVisible();
    await expect(transactionsPage.yearSelect).toBeVisible();

    await expect(transactionsPage.transactionsTable).toBeVisible();

});
