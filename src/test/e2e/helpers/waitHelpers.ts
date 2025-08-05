import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Comprehensive wait strategy for CI environments
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle')
}

/**
 * Wait for Element UI loading to complete - this is critical for CI
 */
export async function waitForElementUILoadingToComplete(page: Page, timeout: number = 60000) {
  // Wait for any Element UI loading masks to disappear
  await page.waitForFunction(
    () => {
      const loadingMasks = document.querySelectorAll('.el-loading-mask')
      const loadingSpinners = document.querySelectorAll('.el-loading-spinner')
      return loadingMasks.length === 0 && loadingSpinners.length === 0
    },
    { timeout }
  )
}

/**
 * Wait for Element UI table to be fully loaded and interactive
 */
export async function waitForElementTableReady(table: Locator, page: Page, options: {
  timeout?: number
  minRows?: number
} = {}) {
  const { timeout = 60000 } = options

  // First ensure table is visible
  await expect(table).toBeVisible({ timeout })

  // Wait for Element UI loading to complete globally
  await waitForElementUILoadingToComplete(page, timeout)

  // Wait for table content to be loaded
  const firstRow = table.getByRole('row').first()
  await expect(firstRow).toBeVisible({ timeout })

  const firstCell = firstRow.getByRole('cell').first()
  await expect(firstCell).toBeVisible({ timeout })
  await expect(firstCell).not.toBeEmpty({ timeout })

  // Final network settle
  await page.waitForLoadState('networkidle', { timeout })

  // Double-check no loading masks are present on the table specifically
  await expect(table.locator('.el-loading-mask')).not.toBeVisible()
}

/**
 * Wait for table to be ready using semantic selectors
 */
export async function waitForTableReady(table: Locator) {
  await expect(table).toBeVisible()
  await expect(table).toBeAttached()

  const tableBody = table.locator('tbody')
  await expect(tableBody).toBeVisible()

  const firstRow = table.getByRole('row').first()
  await expect(firstRow).toBeVisible()
  await expect(firstRow).toBeAttached()

  const firstCell = firstRow.getByRole('cell').first()
  await expect(firstCell).toBeVisible()
  await expect(firstCell).not.toBeEmpty()

  await expect(table).not.toHaveAttribute('aria-busy', 'true')
}

/**
 * Wait for element to be interactive with Element UI considerations
 */
export async function waitForElementInteractive(element: Locator, page: Page) {
  await expect(element).toBeVisible()
  await expect(element).toBeAttached()
  await expect(element).toBeEnabled()

  // Ensure no loading masks are covering this element
  await waitForElementUILoadingToComplete(page)

  await expect(element).not.toHaveAttribute('aria-busy', 'true')
  await expect(element).not.toHaveAttribute('aria-disabled', 'true')
}

/**
 * Safe navigation with proper waits
 */
export async function navigateAndWait(page: Page, url: string | RegExp, options?: {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'
}) {
  await page.waitForURL(url, { waitUntil: options?.waitUntil || 'networkidle' })
  await waitForPageReady(page)
}

/**
 * Wait for dropdown options to be available using semantic selectors
 */
export async function waitForDropdownOptions(page: Page) {
  await page.getByRole('option').first().waitFor({ state: 'visible' })
}

/**
 * Wait for dropdown to be ready with options loaded using semantic selectors
 */
export async function waitForDropdownReady(dropdown: Locator, page: Page) {
  await expect(dropdown).toBeVisible()
  await expect(dropdown).toBeEnabled()

  await dropdown.click()

  await expect(page.getByRole('option').first()).toBeVisible()

  const firstOption = page.getByRole('option').first()
  await expect(firstOption).not.toHaveText(/loading|\.\.\./)
}

/**
 * Wait for modal to be fully ready using semantic selectors
 */
export async function waitForModalReady(modal: Locator) {
  await expect(modal).toBeVisible()

  const dialogContent = modal.getByRole('dialog').first()
  await expect(dialogContent).toBeVisible()

  await expect(modal).not.toHaveAttribute('aria-busy', 'true')
}

/**
 * Robust table row interaction with Element UI loading considerations
 */
export async function rightClickTableRow(table: Locator, page: Page, rowIndex: number = 0) {
  await waitForElementTableReady(table, page)

  const tableRow = table.getByRole('row').nth(rowIndex)
  await waitForElementInteractive(tableRow, page)

  await expect(tableRow.getByRole('cell').first()).not.toBeEmpty()

  await tableRow.click({ button: 'right' })
}

/**
 * Wait for loading to complete - comprehensive version for CI
 */
export async function waitForLoadingToComplete(page: Page, options: {
  timeout?: number
} = {}) {
  const { timeout = 60000 } = options

  // Wait for network to be idle
  await page.waitForLoadState('networkidle', { timeout })

  // Wait for Element UI loading to complete
  await waitForElementUILoadingToComplete(page, timeout)
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

  // Final check - ensure no loading masks are present
  await expect(table.locator('.el-loading-mask')).not.toBeVisible()

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
  await expect(table.locator('.el-loading-mask')).not.toBeVisible()

  await cell.click(clickOptions)
}

export async function debugTableLoadingState(page: Page, testId: string) {
  return await page.evaluate((testId) => {
    const table = document.querySelector(`[data-testid="${testId}"]`)
    if (!table) {
      console.log(`Table with testId "${testId}" not found`)
      return null
    }

    const loadingMask = table.querySelector('.el-loading-mask')
    const loadingSpinner = table.querySelector('.el-loading-spinner')
    const rows = table.querySelectorAll('tbody tr')

    console.log(`Table debug info for ${testId}:`, {
      tableExists: !!table,
      hasLoadingMask: !!loadingMask,
      hasLoadingSpinner: !!loadingSpinner,
      rowCount: rows.length,
      firstRowText: rows[0]?.textContent?.substring(0, 100)
    })

    return {
      tableExists: !!table,
      hasLoadingMask: !!loadingMask,
      hasLoadingSpinner: !!loadingSpinner,
      rowCount: rows.length
    }
  }, testId)
}