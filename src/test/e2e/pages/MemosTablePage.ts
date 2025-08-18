import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import type { Memo } from '@types'

export class MemosTablePage {
  readonly page: Page

  readonly errorAlert: Locator
  readonly memosTable: Locator
  readonly memosPageTitle: Locator
  readonly memoEditModal: Locator
  // MemoEditForm elements
  readonly memoEditForm: Locator

  readonly memoEditFormAvatar: Locator
  readonly memoEditFormNameInput: Locator
  readonly memoEditFormRecurringSwitch: Locator
  readonly memoEditFormNecessarySwitch: Locator
  readonly memoEditFormFrequencySelect: Locator
  readonly memoEditFormBudgetCategoryTreeSelect: Locator
  readonly memoEditFormAmbiguousSwitch: Locator

  constructor(page: Page) {
    this.page = page

    this.errorAlert = page.getByTestId('memo-summary-table-error')
    this.memosTable = page.getByTestId('memos-table')
    this.memosPageTitle = page.getByTestId('memos-table-title')
    this.memoEditModal = page.getByTestId('memo-edit-dialog')


    this.memoEditForm = this.page.getByTestId('memo-edit-form')
    this.memoEditFormAvatar = this.memoEditForm.getByTestId('memo-edit-form-avatar')
    this.memoEditFormNameInput = this.memoEditForm.getByTestId('memo-edit-form-name-input')
    this.memoEditFormRecurringSwitch = this.memoEditForm.getByTestId('memo-edit-form-recurring-switch')
    this.memoEditFormNecessarySwitch = this.memoEditForm.getByTestId('memo-edit-form-necessary-switch')
    this.memoEditFormFrequencySelect = this.memoEditForm.getByTestId('memo-edit-form-frequency-select')
    this.memoEditFormBudgetCategoryTreeSelect = this.memoEditForm
      .getByTestId('memo-edit-form-budget_category-form-item')
      .getByTestId('budget-category-tree-select')
    this.memoEditFormAmbiguousSwitch = this.memoEditForm.getByTestId('memo-edit-form-ambiguous-switch')

  }

  async goTo() {
    await this.page.goto('budget-visualizer/memos')
  }

  async expectError(message?: string) {
    if (message) {
      await expect(this.errorAlert).toHaveAttribute('title', message)
    } else {
      await expect(this.errorAlert).toBeVisible()
    }
  }

  async expectNoError() {
    await expect(this.errorAlert).not.toBeVisible()
  }

  async expectTableVisible() {
    await expect(this.memosTable).toBeVisible()
  }

  async getMemosPageTitle() {
    return this.memosPageTitle.textContent()
  }

  async getMemosCount() {
    return await this.memosTable.getByRole('row').count()
  }

  async clickMemoLink(memo: Memo['name']) {
    const memoLink = this.memosTable.getByRole('cell', { name: memo }).getByRole('link', { name: memo })
    await memoLink.click()
  }

  async getFirstMemoName(): Promise<string> {
    const cell = this.page.getByTestId('cell-0-1')
    return await cell.textContent() ?? ''
  }

  async getFirstMemoNameByDataAttributes(): Promise<string> {
    const cell = this.page.locator('[data-row-index="0"][data-column="name"]')
    return await cell.textContent() ?? ''
  }

  async getFirstMemoNameByRole(): Promise<string> {
    const table = this.page.getByTestId('memos-table')
    const firstRow = table.getByRole('row').nth(1)
    const nameCell = firstRow.getByRole('cell').nth(1)
    return await nameCell.textContent() ?? ''
  }

  async getCellTextContent(rowIndex: number, columnIndex: number): Promise<string> {
    const table = this.page.getByTestId('memos-table')
    const row = table.getByRole('row').nth(rowIndex)
    const cell = row.getByRole('cell').nth(columnIndex)
    return await cell.textContent() ?? ''
  }

  async getCellValueByPosition(rowIndex: number, columnName: string): Promise<string> {
    const cell = this.page.locator(`[data-row-index="${rowIndex}"][data-column="${columnName}"]`)
    return await cell.textContent() ?? ''
  }

  async getFirstMemoNameLink(): Promise<string> {
    const cell = this.page.locator('[data-row-index="0"][data-column="name"]')
    const link = cell.locator('a') // The router-link renders as an <a> tag
    return await link.textContent() ?? ''
  }

  async clickFirstMemoLink(): Promise<void> {
    const cell = this.page.locator('[data-row-index="0"][data-column="name"]')
    const link = cell.locator('a')
    await link.click()
  }

  async rightClickOnFirstMemo() {
    const cell = this.page.locator('[data-row-index="0"][data-column="name"]')
    const link = cell.locator('a')

    // Get the memo name before right-clicking to ensure we know what we're working with
    const memoName = await link.textContent()
    console.log('Right-clicking on memo:', memoName)

    await link.click({ button: 'right' })

    // Wait a bit for the modal to potentially open
    await this.page.waitForTimeout(500)
  }

  async expectMemoEditModalToBeVisible() {
    // Add more debugging to see what's happening
    const isVisible = await this.memoEditModal.isVisible()
    console.log('Modal visible:', isVisible)

    if (!isVisible) {
      // Check if there are any console errors
      const consoleLogs = await this.page.evaluate(() => {
        return window.console.error.toString()
      })
      console.log('Console errors:', consoleLogs)
    }

    await expect(this.memoEditModal).toBeVisible()
  }

  async expectMemoEditFormElementsToBeVisible() {
    await expect(this.memoEditForm).toBeVisible()
    await expect(this.memoEditFormAvatar).toBeVisible()
    await expect(this.memoEditFormNameInput).toBeVisible()
    await expect(this.memoEditFormRecurringSwitch).toBeVisible()
    await expect(this.memoEditFormNecessarySwitch).toBeVisible()
    await expect(this.memoEditFormFrequencySelect).toBeVisible()
    await expect(this.memoEditFormBudgetCategoryTreeSelect).toBeVisible()
    await expect(this.memoEditFormAmbiguousSwitch).toBeVisible()
  }

}
