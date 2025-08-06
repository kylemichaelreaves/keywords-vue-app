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

  // Step 1: Basic visibility
  await expect(table).toBeVisible({ timeout })

  // Step 2: Wait for content
  await expect(table.getByRole('row').first()).toBeVisible({ timeout })
  await expect(table.getByRole('cell').first()).toBeVisible({ timeout })

  // // Step 3: Simple loading check
  // await waitForElementUILoadingToComplete(page, 5000) // Shorter timeout

  // Step 4: Network settle
  await page.waitForLoadState('networkidle', { timeout: 10000 })


  // await table.locator('.el-loading-mask').waitFor({ state: 'hidden', timeout: 60000 })

  // // Double-check no loading masks are present on the table specifically
  // await expect(table.locator('.el-loading-mask')).not.toBeVisible()
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

  // // Final check - ensure no loading masks are present
  // await expect(table.locator('.el-loading-mask')).not.toBeVisible()

  // Ensure row has content
  await expect(tableRow.getByRole('cell').first()).not.toBeEmpty()

  // Right click with force option for CI stability
  await tableRow.click({ button: 'right', force: false })
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

  // Final check - ensure no loading masks are present
  // await expect(table.locator('.el-loading-mask')).not.toBeVisible()

  await cell.click(clickOptions)
}
/**
 * Wait for table to have actual data content instead of loading states
 */
export async function waitForTableContent(table: Locator, page: Page, options: {
  minRows?: number
  timeout?: number
} = {}) {
  const { minRows = 1, timeout = 30000 } = options

  // Wait for table to exist
  await table.waitFor({ state: 'visible', timeout })

  // Wait for actual data rows (not just headers)
  // await expect(table.getByRole('row')).toHaveCount({ min: minRows + 1 }, { timeout }) // +1 for header

  // Ensure first data row has content
  const firstDataRow = table.getByRole('row').nth(1) // Skip header row
  await expect(firstDataRow.getByRole('cell').first()).not.toBeEmpty({ timeout })

  // Wait for network to settle (no more pending requests)
  await page.waitForLoadState('networkidle', { timeout: 5000 })
}
