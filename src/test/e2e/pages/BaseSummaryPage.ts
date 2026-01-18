import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { rightClickElementTableRow, waitForTableContent } from '@test/e2e/helpers/waitHelpers'

export abstract class BaseSummaryPage {
  readonly page: Page

  // Common memo edit modal elements
  readonly memoEditDialog: Locator
  readonly memoEditForm: Locator
  readonly memoEditFormTitle: Locator
  readonly memoEditFormCloseButton: Locator

  // Common elements that most summary pages have
  readonly errorAlert: Locator
  readonly resetButton: Locator
  readonly budgetCategorySummaries: Locator
  readonly navigationButtonGroup: Locator

  constructor(page: Page) {
    this.page = page

    // Initialize common memo edit elements
    this.memoEditDialog = page.getByTestId('memo-edit-dialog')
    this.memoEditForm = page.getByTestId('memo-edit-form')
    this.memoEditFormTitle = this.memoEditDialog.getByRole('heading')
    this.memoEditFormCloseButton = this.memoEditDialog.getByRole('button', { name: /close/i })

    // Initialize common elements (to be overridden by subclasses if needed)
    this.errorAlert = this.getErrorAlert()
    this.resetButton = this.getResetButton()
    this.budgetCategorySummaries = this.getBudgetCategorySummaries()
    this.navigationButtonGroup = this.getNavigationButtonGroup()
  }

  // Abstract methods to be implemented by subclasses
  abstract getErrorAlert(): Locator
  abstract getResetButton(): Locator
  abstract getBudgetCategorySummaries(): Locator
  abstract getNavigationButtonGroup(): Locator
  abstract getSummaryTable(): Locator

  // Common memo edit modal functionality with proper Element UI loading handling
  async rightClickOnTableRow(rowIndex: number = 0) {
    const summaryTable = this.getSummaryTable()

    // Wait for any Element UI loading to complete first
    // await waitForElementUILoadingToComplete(this.page)

    // Use the comprehensive Element UI-aware table waiting and clicking
    await rightClickElementTableRow(summaryTable, this.page, rowIndex)

    // Wait for context menu or modal to appear
    await expect(this.memoEditDialog).toBeVisible()
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

  async clickResetButton() {
    await expect(this.resetButton).toBeVisible()
    await expect(this.resetButton).toBeEnabled()
    await this.resetButton.click()
    await this.page.waitForURL(/\/budget-visualizer\/transactions/)
  }

  async expectTableVisible() {
    const table = this.getSummaryTable()

    // Wait for actual content instead of spinner states
    await waitForTableContent(table, this.page, { minRows: 1 })

    return true
  }

  async expectTableHasData() {
    const table = this.getSummaryTable()
    const rows = table.getByRole('row')
    const cells = rows.getByRole('cell')

    // More specific content checks
    await expect(cells.first()).not.toBeEmpty()

    return true
  }
}
