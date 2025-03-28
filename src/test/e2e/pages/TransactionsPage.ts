import type { Locator, Page} from '@playwright/test';

export class TransactionsPage {
    readonly transactionsTable: Locator;
    readonly daySelect: Locator;
    readonly weekSelect: Locator;
    readonly monthSelect: Locator;
    readonly yearSelect: Locator;
    readonly memoSelect: Locator;
    readonly intervalTypeSelect: Locator;
    readonly intervalNumberInput: Locator;
    readonly intervalLineChart: Locator
    readonly transactionsTablePagination: Locator;

    constructor(public readonly page: Page) {
        this.transactionsTable = this.page.getByTestId('transactions-table')
        this.daySelect = this.page.getByTestId('day-select')
        this.weekSelect = this.page.getByTestId('week-select')
        this.monthSelect = this.page.getByTestId('month-select')
        this.yearSelect = this.page.getByTestId('year-select')
        this.memoSelect = this.page.getByTestId('memo-select')
        this.intervalLineChart = this.page.getByTestId('daily-interval-line-chart')
        this.intervalTypeSelect = this.page.getByRole('main').getByText('Month', { exact: true })
        this.intervalNumberInput = this.page.getByRole('spinbutton', { name: 'Interval Count' })
        this.transactionsTablePagination = this.page.getByTestId('transactions-table-pagination')
    }

    async goto() {
        await this.page.goto('budget-visualizer/transactions');
    }

    async clickOnDaySelect() {
        await this.daySelect.click()
    }

    async clickIncreaseInterval()  {
        await this.page.locator('button').filter({ hasText: /^Increase Interval$/ }).click()
    }

    async clickDecreaseInterval()  {
        await this.page.locator('button').filter({ hasText: /^Decrease Interval$/ }).click()
    }

}
