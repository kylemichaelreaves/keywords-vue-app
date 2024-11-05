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
        this.transactionsTable = this.page.locator('.el-table__inner-wrapper');
        this.daySelect = this.page.locator('div').filter({ hasText: /^select a day$/ }).nth(4)
        this.weekSelect = this.page.locator('div').filter({ hasText: /^select a week$/ }).nth(2)
        this.monthSelect = this.page.locator('div').filter({ hasText: /^select a month$/ }).nth(2)
        this.yearSelect = this.page.locator('div').filter({ hasText: /^select a year$/ }).nth(2)
        this.memoSelect = this.page.locator('div').filter({ hasText: /^select a memo$/ }).nth(2)
        this.intervalTypeSelect = this.page.locator('div').filter({ hasText: /^Interval TypeMonths$/ })
        this.intervalNumberInput = this.page.locator('div').filter({ hasText: /^Interval Count$/ })
        this.intervalLineChart = this.page.getByTestId('daily-line-chart')
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
