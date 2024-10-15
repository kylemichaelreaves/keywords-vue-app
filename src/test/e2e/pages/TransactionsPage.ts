import type { Locator, Page} from '@playwright/test';

export class TransactionsPage {
    readonly transactionsTable: Locator;
    readonly daySelect: Locator;
    readonly weekSelect: Locator;
    readonly monthSelect: Locator;
    readonly yearSelect: Locator;
    readonly memoSelect: Locator;

    constructor(public readonly page: Page) {
        this.transactionsTable = this.page.locator('.el-table');
        this.daySelect = this.page.locator('div').filter({ hasText: /^select a day$/ }).nth(4)
        this.weekSelect = this.page.locator('div').filter({ hasText: /^select a week$/ }).nth(2)
        this.monthSelect = this.page.locator('div').filter({ hasText: /^select a month$/ }).nth(2)
        this.yearSelect = this.page.locator('div').filter({ hasText: /^select a year$/ }).nth(2)
        this.memoSelect = this.page.locator('div').filter({ hasText: /^select a memo$/ }).nth(2)
    }

    async goto() {
        await this.page.goto('budget-visualizer/transactions');
    }

    async clickOnDaySelect() {
        await this.daySelect.click()
    }

}
