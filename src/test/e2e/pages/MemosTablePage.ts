import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import type { Memo } from '@types'

export class MemosTablePage {
  readonly page: Page

  readonly errorAlert: Locator
  readonly memosTable: Locator
  readonly memosPageTitle: Locator

  constructor(page: Page) {
    this.page = page

    this.errorAlert = page.getByTestId('memo-summary-table-error')
    this.memosTable = page.getByTestId('memos-table')
    this.memosPageTitle = page.getByTestId('memos-table-title')

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

  // async clickBackButton() {
  //   const backButton = this.page.getByRole('button', { name: 'Go Back' })
  //   await backButton.click()
  // }
  //
  // async clickBackButton() {
  //   await this.backButton.click()
  // }


  // Method 1: Using coordinate-based test ID
  // Row 0, Column 1 (name column is the second column, index 1)
  async getFirstMemoName(): Promise<string> {
    const cell = this.page.getByTestId('cell-0-1')
    return await cell.textContent() ?? ''
  }

  // Method 2: Using data attributes
  async getFirstMemoNameByDataAttributes(): Promise<string> {
    const cell = this.page.locator('[data-row-index="0"][data-column="name"]')
    return await cell.textContent() ?? ''
  }

  // Method 3: Using table structure with role-based locators
  async getFirstMemoNameByRole(): Promise<string> {
    const table = this.page.getByTestId('memos-table')
    const firstRow = table.getByRole('row').nth(1) // nth(1) because header is row 0
    const nameCell = firstRow.getByRole('cell').nth(1) // name column is index 1
    return await nameCell.textContent() ?? ''
  }

  // Method 4: More flexible - get any cell value by row and column name
  async getCellValueByPosition(rowIndex: number, columnName: string): Promise<string> {
    const cell = this.page.locator(`[data-row-index="${rowIndex}"][data-column="${columnName}"]`)
    return await cell.textContent() ?? ''
  }

  // Method 5: Get the router-link text specifically (since name column has a link)
  async getFirstMemoNameLink(): Promise<string> {
    const cell = this.page.locator('[data-row-index="0"][data-column="name"]')
    const link = cell.locator('a') // The router-link renders as an <a> tag
    return await link.textContent() ?? ''
  }

  // Method 6: Get first memo name and click the link
  async clickFirstMemoLink(): Promise<void> {
    const cell = this.page.locator('[data-row-index="0"][data-column="name"]')
    const link = cell.locator('a')
    await link.click()
  }

}