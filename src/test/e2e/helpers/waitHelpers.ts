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
 * CI FIX: Enhanced for CI environment with longer timeouts and better error handling
 */
export async function waitForTableContent(table: Locator, page: Page, options: {
  minRows?: number
  timeout?: number
} = {}) {
  const { timeout = 30000 } = options
  const isCI = !!process.env.CI

  if (isCI) {
    console.log('[CI WAIT] Starting table content wait with timeout:', timeout)
  }

  // CRITICAL FIX: Simple visibility check first
  await table.waitFor({ state: 'visible', timeout })

  // CRITICAL FIX: Wait for any row to exist (including header)
  const anyRow = table.getByRole('row').first()
  await expect(anyRow).toBeVisible({ timeout })

  // CI FIX: More robust table content detection
  await page.waitForFunction((timeoutMs) => {
    const tableElement = document.querySelector('[data-testid="transactions-table"]')
    if (!tableElement) {
      console.log('[CI DEBUG] Table element not found')
      return false
    }

    const rows = tableElement.querySelectorAll('tr')
    // Check if we have at least 2 rows (header + 1 data row)
    if (rows.length < 2) {
      console.log('[CI DEBUG] Insufficient rows:', rows.length)
      return false
    }

    // Check if the second row (first data row) has cells with content
    const firstDataRow = rows[1]
    const cells = firstDataRow.querySelectorAll('td')
    const hasContent = cells.length > 0 && Array.from(cells).some(cell => {
      const text = cell.textContent?.trim()
      return text !== '' && text !== 'Loading...' && text !== '--'
    })

    if (!hasContent) {
      console.log('[CI DEBUG] No content in cells yet')
    }

    return hasContent
  }, timeout, { timeout })

  // CI-specific: Give more time for rendering to complete
  if (isCI) {
    await page.waitForTimeout(1500) // Increased from 500ms for CI
    console.log('[CI WAIT] Table content wait complete')
  } else {
    await page.waitForTimeout(500)
  }
}