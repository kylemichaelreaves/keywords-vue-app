import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { waitForElementTableReady, rightClickElementTableRow, waitForLoadingToComplete } from '@test/e2e/helpers/waitHelpers'

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

    // Wait for any loading masks to disappear
    await waitForLoadingToComplete(this.page)

    const summaryTable = this.getSummaryTable()

    // Use the Element UI specific table waiting function
    await rightClickElementTableRow(summaryTable, this.page, rowIndex)

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

    // Wait for loading to complete
    await waitForLoadingToComplete(this.page)

    const table = this.getSummaryTable()

    // Use Element UI specific table ready check
    await waitForElementTableReady(table, this.page)

    return true
  }
}
