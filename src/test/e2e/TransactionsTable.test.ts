// import {test, expect} from '@playwright/test';
import {test, expect} from '@test/e2e/fixtures/PageFixture';
import {TransactionsPage} from "@test/e2e/pages/TransactionsPage";
import {generateTransactions, intervalsMock} from "@mocks/transaction";

test('clicking the Transactions icon on the menu NavBar opens the TransactionsTable', async ({page, context}) => {
    await context.tracing.start({ screenshots: true, snapshots: true });

    page.on('request', request => {
        console.log('>>', request.method(), request.url());
    });

    page.on('response', response => {
        console.log('<< Response:', response.status(), response.url());
    });

    page.on('console', msg => {
        console.log(`Console [${msg.type()}]: ${msg.text()}`);
    });

    page.on('pageerror', error => {
        console.log('Uncaught exception:', error);
    });

    await page.route('**/transactions/get-transactions?*', async (route) => {
        console.log('Mocking get-transactions');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(generateTransactions(200)),
        });
    });

    await page.route('**/transactions/get-daily-total-amount-debit?**', async (route) => {
        console.log('Mocking get-daily-total-amount-debit');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(intervalsMock),
        });
    });


    const transactionsPage = new TransactionsPage(page);

    await transactionsPage.goto();

    await expect(transactionsPage.transactionsTable).toBeVisible();
    await expect(transactionsPage.daySelect).toBeVisible();
    await expect(transactionsPage.weekSelect).toBeVisible();
    await expect(transactionsPage.monthSelect).toBeVisible();
    await expect(transactionsPage.yearSelect).toBeVisible();
    await expect(transactionsPage.memoSelect).toBeVisible();
    await expect(transactionsPage.intervalLineChart).toBeVisible({timeout: 10000});
    await expect(transactionsPage.intervalTypeSelect).toBeVisible();
    await expect(transactionsPage.intervalNumberInput).toBeVisible();
    await expect(transactionsPage.transactionsTablePagination).toBeVisible();

    await context.tracing.stop({ path: 'trace.zip' });
});
