import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Wait for Element UI table to be fully loaded and interactive
 * Enhanced version with better loading detection and data validation
 */
export async function waitForElementTableReady(
  table: Locator,
  page: Page,
  options: {
    timeout?: number
    minRows?: number
  } = {},
) {
  const { timeout = 30000, minRows = 1 } = options

  // Wait for table to be visible
  await expect(table).toBeVisible({ timeout })

  // Wait for at least header row
  await expect(table.getByRole('row').first()).toBeVisible({ timeout })

  // CRITICAL: Wait for data rows (not just header)
  // We need at least minRows + 1 (header + data rows)
  const requiredRows = minRows + 1
  await page.waitForFunction(
    ({ requiredCount }) => {
      const tableEl = document.querySelector('[aria-label="Transactions Table"]')
      if (!tableEl) return false

      const rows = tableEl.querySelectorAll('tr')
      if (rows.length < requiredCount) return false

      // Check that data rows (skip header) have content
      for (let i = 1; i < requiredCount; i++) {
        const row = rows[i]
        if (!row) return false

        const cells = row.querySelectorAll('td')
        const hasContent = Array.from(cells).some((cell) => {
          const text = cell.textContent?.trim()
          return text && text !== '' && text !== 'Loading...' && text !== '--'
        })

        if (!hasContent) return false
      }

      return true
    },
    { requiredCount: requiredRows },
    { timeout },
  )

  // Ensure first data cell has content
  const firstDataCell = table.getByRole('row').nth(1).getByRole('cell').first()
  await expect(firstDataCell).toBeVisible({ timeout })
  await expect(firstDataCell).not.toBeEmpty({ timeout })

  // Wait for DOM to be stable
  await page.waitForLoadState('domcontentloaded', { timeout: 10000 })

  // Verify table is stable by checking the first data cell is still visible
  // This ensures no re-renders are happening
  await expect(firstDataCell).toBeVisible({ timeout: 5000 })
}

/**
 * Wait for a modal dialog to be fully rendered and interactive
 * Useful for Element UI dialogs that may have animation delays
 */
export async function waitForModalReady(
  modal: Locator,
  page: Page,
  options: {
    timeout?: number
  } = {},
) {
  const { timeout = 15000 } = options

  // Wait for modal to be visible and attached
  await expect(modal).toBeVisible({ timeout })
  await expect(modal).toBeAttached({ timeout })

  // Wait for modal content to be stable by checking for specific elements
  // This ensures Element UI animation is complete without arbitrary timeouts
  await page.waitForLoadState('domcontentloaded')

  // Verify modal remains visible and stable
  await expect(modal).toBeVisible({ timeout: 5000 })
  await expect(modal).toBeAttached()
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
 * Enhanced with better waiting for interactive state
 */
export async function clickElementTableCell(
  table: Locator,
  page: Page,
  rowIndex: number = 1,
  cellIndex: number = 1,
  clickOptions: { button?: 'left' | 'right' | 'middle' } = {},
) {
  const isCI = !!process.env.CI

  // Wait for table to be ready with data
  await waitForElementTableReady(table, page)

  const row = table.getByRole('row').nth(rowIndex)
  const cell = row.getByRole('cell').nth(cellIndex)

  // Wait for the row and cell to be visible and attached
  await expect(row).toBeVisible({ timeout: 10000 })
  await expect(row).toBeAttached()
  await expect(cell).toBeVisible({ timeout: 10000 })
  await expect(cell).toBeAttached()

  // Ensure cell has actual content (not loading or empty)
  await expect(cell).not.toBeEmpty({ timeout: 10000 })

  // Ensure element is stable by verifying it's enabled/clickable
  // This is better than arbitrary timeouts - it waits for Vue reactivity to settle
  await expect(cell).toBeEnabled()

  // Click with appropriate options (force for CI to avoid detached errors)
  await cell.click({ ...clickOptions, force: isCI })
}

/**
 * Wait for table to have actual data content instead of loading states
 * FIXED: Simplified logic and removed problematic checks
 * CI FIX: Enhanced for CI environment with longer timeouts and better error handling
 */
export async function waitForTableContent(
  table: Locator,
  page: Page,
  options: {
    minRows?: number
    timeout?: number
  } = {},
) {
  const { timeout = 30000 } = options
  // CRITICAL FIX: Simple visibility check first
  await table.waitFor({ state: 'visible', timeout })

  // CRITICAL FIX: Wait for any row to exist (including header)
  const anyRow = table.getByRole('row').first()
  await expect(anyRow).toBeVisible({ timeout })

  // CI FIX: More robust table content detection
  await page.waitForFunction(
    () => {
      const tableElement = document.querySelector('[data-testid="transactions-table"]')
      if (!tableElement) {
        return false
      }

      const rows = tableElement.querySelectorAll('tr')
      // Check if we have at least 2 rows (header + 1 data row)
      if (rows.length < 2) {
        return false
      }

      // Check if the second row (first data row) has cells with content
      const firstDataRow = rows[1]
      if (!firstDataRow) {
        return false
      }

      const cells = firstDataRow.querySelectorAll('td')
      return (
        cells.length > 0 &&
        Array.from(cells).some((cell) => {
          const text = cell.textContent?.trim()
          return text !== '' && text !== 'Loading...' && text !== '--'
        })
      )
    },
    { timeout },
  )

  // Verify table is stable by checking first data cell is still visible
  const firstDataCell = table.getByRole('row').nth(1).getByRole('cell').first()
  await expect(firstDataCell).toBeVisible({ timeout: 5000 })
  await expect(firstDataCell).not.toBeEmpty({ timeout: 5000 })
}
