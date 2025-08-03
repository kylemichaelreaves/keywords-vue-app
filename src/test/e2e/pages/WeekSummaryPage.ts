import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export class WeekSummaryPage {
  readonly page: Page

  readonly errorAlert: Locator
  readonly weekSummaryTable: Locator
  readonly budgetCategorySummaries: Locator
  readonly resetButton: Locator
  readonly weekTitle: Locator
  readonly navigationButtonGroup: Locator
  readonly daySummariesTable: Locator

  // New selectors for memo edit modal and form
  readonly memoEditDialog: Locator
  readonly memoEditForm: Locator
  readonly memoEditFormTitle: Locator
  readonly memoEditFormCloseButton: Locator

  constructor(page: Page) {
    this.page = page

    this.errorAlert = page.getByTestId('week-error-alert')
    this.weekSummaryTable = page.getByTestId('week-summary-table')
    this.resetButton = page.getByRole('button', { name: 'Reset Week' })
    this.weekTitle = page.locator('h2')
    this.budgetCategorySummaries = page.getByTestId('budget-category-summaries-for-week')
    this.navigationButtonGroup = page.getByTestId('week-navigation-button-group')
    this.daySummariesTable = page.getByTestId('day-summaries-for-selected-week-table')

    this.memoEditDialog = page.getByTestId('memo-edit-dialog')
    this.memoEditForm = this.memoEditDialog.getByTestId('memo-edit-form')
    this.memoEditFormTitle = this.memoEditDialog.getByRole('heading', { name: /edit memo/i })
    this.memoEditFormCloseButton = this.memoEditDialog.getByRole('button', { name: /close/i })
  }

  async goTo(weekId: string) {
    await this.page.goto(`budget-visualizer/transactions/weeks/${weekId}/summary`)
  }

  async clickResetButton() {
    await this.resetButton.click()
  }

  async expectError(message?: string) {
    if (message) {
      expect(this.errorAlert).toHaveAttribute('title', message)
    } else {
      expect(this.errorAlert.isVisible())
    }
  }

  async expectNoError() {
    expect(this.errorAlert.isHidden())
  }

  async getWeekTitle() {
    return this.weekTitle.textContent()
  }

  // async getStats() {
  //   return {
  //     transactionsCount: await this.transactionsCount.textContent(),
  //     transactionsAmount: await this.transactionsAmount.textContent()
  //   }
  // }

  expectTableVisible() {
    return this.weekSummaryTable.isVisible()
  }

  async rightClickOnTableRow(rowIndex: number = 0) {
    const tableRow = this.weekSummaryTable.locator('tbody tr').nth(rowIndex)
    await expect(tableRow).toBeVisible()
    await tableRow.click({ button: 'right' })
  }

  async expectMemoEditModalVisible() {
    await expect(this.memoEditDialog).toBeVisible()
  }

  async expectMemoEditModalHidden() {
    await expect(this.memoEditDialog).toBeHidden()
  }

  async expectMemoEditFormVisible() {
    await expect(this.memoEditForm).toBeVisible()
  }

  async expectMemoEditFormTitle(expectedTitle: string) {
    await expect(this.memoEditFormTitle).toContainText(expectedTitle)
  }

  async closeMemoEditModal() {
    await this.memoEditFormCloseButton.click()
  }
}