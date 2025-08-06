import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Wait for Element UI table to be fully loaded and interactive
 * Enhanced version with better loading detection
 */
export async function waitForElementTableReady(table: Locator, page: Page, options: {
  timeout?: number
  minRows?: number
} = {}) {
  const { timeout = 30000 } = options

  await expect(table).toBeVisible({ timeout })

  await expect(table.getByRole('row').first()).toBeVisible({ timeout })
  await expect(table.getByRole('cell').first()).toBeVisible({ timeout })

  await page.waitForLoadState('networkidle', { timeout: 10000 })

}

/**
 * Safe table row interaction with comprehensive Element UI support
 */
export async function rightClickElementTableRow(table: Locator, page: Page, rowIndex: number = 0) {
  // Comprehensive table ready check including Element UI loading
  await waitForElementTableReady(table, page)

  const tableRow = table.getByRole('row').nth(rowIndex)

  // Ensure row is ready for interaction
  await expect(tableRow).toBeVisible()
  await expect(tableRow).toBeAttached()

  // Ensure row has content
  await expect(tableRow.getByRole('cell').first()).not.toBeEmpty()

  // Right click with force option for CI stability
  await tableRow.click({ button: 'right', force: !!process.env.isCI })
}

/**
 * Safe table cell click with comprehensive Element UI support
 */
export async function clickElementTableCell(
  table: Locator,
  page: Page,
  rowIndex: number = 1,
  cellIndex: number = 1,
  clickOptions: { button?: 'left' | 'right' | 'middle' } = {}
) {
  await waitForElementTableReady(table, page)

  const row = table.getByRole('row').nth(rowIndex)
  const cell = row.getByRole('cell').nth(cellIndex)

  await expect(cell).toBeVisible()
  await expect(cell).toBeAttached()

  await cell.click(clickOptions)
}

/**
 * Wait for table to have actual data content instead of loading states
 */
export async function waitForTableContent(table: Locator, page: Page, options: {
  minRows?: number
  timeout?: number
} = {}) {
  const { minRows = 1, timeout = 10000 } = options

  // Wait for table to exist
  await table.waitFor({ state: 'visible', timeout })

  // Ensure first data row has content
  const firstDataRow = table.getByRole('row').nth(1) // Skip header row
  await expect(firstDataRow.getByRole('cell').first()).not.toBeEmpty({ timeout })

  // Wait for network to settle (no more pending requests)
  await page.waitForLoadState('networkidle', { timeout: 10000 })
}


export async function rightClickAndOpenDialog(
  page: Page,
  targetSelector: string,
  options: { timeout?: number } = {}
) {
  const { timeout = 15000 } = options

  // Right-click on target - this directly opens the dialog
  await page.locator(targetSelector).click({ button: 'right' })

  // Wait for dialog to appear
  await page.getByRole('dialog').waitFor({ timeout })

  // Wait for form inside dialog to be ready
  await page.getByRole('dialog').locator('form').waitFor({ timeout: 5000 })
}
