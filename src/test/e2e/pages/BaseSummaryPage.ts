import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

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

  // Common memo edit modal functionality
  async rightClickOnTableRow(rowIndex: number = 0) {
    const tableRow = this.getSummaryTable().locator('tbody tr').nth(rowIndex)
    await expect(tableRow).toBeVisible()

    // Wait for table to be stable and interactive instead of hardcoded timeout
    await expect(tableRow).toBeEnabled()

    await tableRow.click({ button: 'right' })

    // Wait for context menu or modal to appear instead of hardcoded timeout
    await expect(this.memoEditDialog).toBeVisible()
  }

  async expectMemoEditModalVisible() {
    // Use Playwright's built-in retry logic instead of hardcoded timeout
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

  // Common error handling functionality
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

  // Common reset functionality
  async clickResetButton() {
    await this.resetButton.click()
    await this.page.waitForURL(/\/budget-visualizer\/transactions/)
  }

  // Common table visibility check
  async expectTableVisible() {
    return await expect(this.getSummaryTable()).toBeVisible()
  }
}
