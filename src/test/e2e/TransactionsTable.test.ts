// import {test, expect} from '@playwright/test';
import {test, expect} from '@test/e2e/fixtures/PageFixture';
import {TransactionsPage} from "@test/e2e/pages/TransactionsPage";
import {daysMock, generateTransactions, intervalsMock, memosMock, monthsMock, weeksMock} from "@mocks/transaction";

test.describe('TransactionsTable', () => {
    // await context.tracing.start({ screenshots: true, snapshots: true });

    test.beforeEach(async ({page}) => {
        const routes = {
            '**/transactions/get-transactions?*': {
                body: JSON.stringify(generateTransactions(200)),
            },
            '**/transactions/get-weeks': {
                body: JSON.stringify(weeksMock),
            },
            '**/transactions/get-months': {
                body: JSON.stringify(monthsMock),
            },
            '**/transactions/get-years': {
                body: JSON.stringify([{year: 2021}, {year: 2022}, {year: 2023}]),
            },
            '**/transactions/get-days': {
                body: JSON.stringify(daysMock),
            },
            '**/transactions/get-daily-total-amount-debit?**': {
                body: JSON.stringify(intervalsMock),
            },
            '**/transactions/is-interval-greater-than-oldest-date?**': {
                body: JSON.stringify([{is_out_of_range: false}]),
            },
            '**/transactions/get-memos': {
                body: JSON.stringify(memosMock),
            },
        };

        for (const [route, config] of Object.entries(routes)) {
            await page.route(route, async (r) => {
                await r.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: config.body,
                });
            });
        }
    })


    test('clicking the Transactions icon on the menu NavBar opens the TransactionsTable', async ({page}) => {

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
        await expect(transactionsPage.transactionsTablePagination).toBeVisible()

        await transactionsPage.clickOnDaySelect();
        // expect the day options to be visible
        await expect(page.getByText('12-31-202212-30-202212-29-')).toBeVisible();

        await transactionsPage.clickOnDaySelect();
        // expect the week options to be invisible
        await expect(page.getByText('12-31-202212-30-202212-29-')).not.toBeVisible();

        // await context.tracing.stop({ path: 'trace.zip' });

    });

    test('clicking on the day select should show the day options', async ({page}) => {
        const transactionsPage = new TransactionsPage(page);

        await transactionsPage.goto();

        await transactionsPage.clickOnDaySelect();
        // expect the day options to be visible
        await expect(page.getByText('12-31-202212-30-202212-29-')).toBeVisible();
    });


});

