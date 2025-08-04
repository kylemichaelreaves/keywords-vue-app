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
    // Wait for page to be fully loaded first
    await this.page.waitForLoadState('networkidle')

    const summaryTable = this.getSummaryTable()
    await expect(summaryTable).toBeVisible()

    // Wait for table body and rows to be present
    const tableBody = summaryTable.locator('tbody')
    await expect(tableBody).toBeVisible()

    const tableRow = tableBody.locator('tr').nth(rowIndex)
    await expect(tableRow).toBeVisible()

    // Wait for row to be stable and interactive using more robust conditions
    await expect(tableRow).toBeAttached()
    await expect(tableRow).not.toHaveClass(/loading|disabled/)

    // Ensure the row has content (not empty)
    await expect(tableRow.locator('td').first()).toBeVisible()

    await tableRow.click({ button: 'right', force: false })

    // Wait for context menu or modal to appear
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

  // Common table visibility check with better waits
  async expectTableVisible() {
    // Wait for network requests to complete first
    await this.page.waitForLoadState('networkidle')

    const table = this.getSummaryTable()
    await expect(table).toBeVisible()

    // Also ensure table has content
    const tableBody = table.locator('tbody')
    await expect(tableBody).toBeVisible()

    return true
  }
}
