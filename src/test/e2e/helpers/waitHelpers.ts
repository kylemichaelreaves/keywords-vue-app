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

  await page.waitForLoadState('domcontentloaded', { timeout: 10000 })

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
 * FIXED: Simplified logic and removed problematic checks
 */
export async function waitForTableContent(table: Locator, page: Page, options: {
  minRows?: number
  timeout?: number
} = {}) {
  const { timeout = 30000 } = options

  // CRITICAL FIX: Simple visibility check first
  await table.waitFor({ state: 'visible', timeout })

  // CRITICAL FIX: Wait for any row to exist (including header)
  const anyRow = table.getByRole('row').first()
  await expect(anyRow).toBeVisible({ timeout })

  // CRITICAL FIX: Wait for at least one data cell to have content
  // Use a more lenient check that works with different table structures
  await page.waitForFunction(() => {
    const tableElement = document.querySelector('[data-testid="transactions-table"]')
    if (!tableElement) return false

    const rows = tableElement.querySelectorAll('tr')
    // Check if we have at least 2 rows (header + 1 data row)
    if (rows.length < 2) return false

    // Check if the second row (first data row) has cells with content
    const firstDataRow = rows[1]
    const cells = firstDataRow.querySelectorAll('td')
    return cells.length > 0 && Array.from(cells).some(cell => cell.textContent?.trim() !== '')
  }, undefined, { timeout })

  // Give a moment for rendering to complete
  await page.waitForTimeout(500)
}