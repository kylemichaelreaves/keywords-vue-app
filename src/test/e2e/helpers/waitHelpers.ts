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
 * Wait for a table to be fully loaded and interactive using semantic selectors
 */
export async function waitForTableReady(table: Locator) {
  await expect(table).toBeVisible()
  await expect(table).toBeAttached()

  // Wait for table body to be present using semantic approach
  const tableBody = table.locator('tbody')
  await expect(tableBody).toBeVisible()

  // Ensure at least one data row exists using role-based selectors
  const firstRow = table.getByRole('row').first()
  await expect(firstRow).toBeVisible()
  await expect(firstRow).toBeAttached()

  // Wait for row content to be loaded using semantic cell selector
  const firstCell = firstRow.getByRole('cell').first()
  await expect(firstCell).toBeVisible()
  await expect(firstCell).not.toBeEmpty()

  // Ensure table is interactive (not in loading state)
  await expect(table).not.toHaveAttribute('aria-busy', 'true')
}

/**
 * Wait for element to be interactive using semantic checks
 */
export async function waitForElementInteractive(element: Locator) {
  await expect(element).toBeVisible()
  await expect(element).toBeAttached()
  await expect(element).toBeEnabled()

  // Use semantic attributes to check loading state
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

  // Click to open dropdown
  await dropdown.click()

  // Wait for options to be available using semantic role
  await expect(page.getByRole('option').first()).toBeVisible()

  // Ensure options have loaded (not loading placeholders)
  const firstOption = page.getByRole('option').first()
  await expect(firstOption).not.toHaveText(/loading|\.\.\./)
}

/**
 * Wait for modal to be fully ready using semantic selectors
 */
export async function waitForModalReady(modal: Locator) {
  await expect(modal).toBeVisible()

  // Wait for modal dialog content using semantic role
  const dialogContent = modal.getByRole('dialog').first()
  await expect(dialogContent).toBeVisible()

  // Ensure modal is not in loading state using semantic attributes
  await expect(modal).not.toHaveAttribute('aria-busy', 'true')
}

/**
 * Robust table row interaction using semantic selectors
 */
export async function rightClickTableRow(table: Locator, rowIndex: number = 0) {
  await waitForTableReady(table)

  const tableRow = table.getByRole('row').nth(rowIndex)
  await waitForElementInteractive(tableRow)

  // Ensure row has actual content using semantic cell selector
  await expect(tableRow.getByRole('cell').first()).not.toBeEmpty()

  await tableRow.click({ button: 'right' })
}

/**
 * Wait for loading to complete using network activity - simplified version
 */
export async function waitForLoadingToComplete(page: Page, options: {
  timeout?: number
} = {}) {
  const { timeout = 30000 } = options

  // Just wait for network to be idle - this is usually sufficient
  await page.waitForLoadState('networkidle', { timeout })
}

/**
 * Wait for table to be fully loaded using semantic selectors only - ultra simplified
 */
export async function waitForElementTableReady(table: Locator, page: Page, options: {
  timeout?: number
  minRows?: number
} = {}) {
  const { timeout = 30000 } = options

  // Just ensure table is visible and has content
  await expect(table).toBeVisible({ timeout })

  // Wait for at least one row with content
  const firstRow = table.getByRole('row').first()
  await expect(firstRow).toBeVisible({ timeout })

  const firstCell = firstRow.getByRole('cell').first()
  await expect(firstCell).toBeVisible({ timeout })
  await expect(firstCell).not.toBeEmpty({ timeout })

  // Wait for network to settle
  await page.waitForLoadState('networkidle', { timeout })
}

/**
 * Safe table row interaction using semantic selectors - simplified version
 */
export async function rightClickElementTableRow(table: Locator, page: Page, rowIndex: number = 0) {
  await waitForElementTableReady(table, page)

  // Use semantic row selector
  const tableRow = table.getByRole('row').nth(rowIndex)

  // Ensure row is ready for interaction using semantic checks
  await expect(tableRow).toBeVisible()
  await expect(tableRow).toBeAttached()

  // Ensure row has actual content using semantic cell selector
  await expect(tableRow.getByRole('cell').first()).not.toBeEmpty()

  // Simple right click - the waitForElementTableReady already ensures it's clickable
  await tableRow.click({ button: 'right' })
}

/**
 * Safe table cell click using semantic selectors - simplified version
 */
export async function clickElementTableCell(
  table: Locator,
  page: Page,
  rowIndex: number = 1,
  cellIndex: number = 1,
  clickOptions: { button?: 'left' | 'right' | 'middle' } = {}
) {
  await waitForElementTableReady(table, page)

  // Use semantic selectors for row and cell
  const row = table.getByRole('row').nth(rowIndex)
  const cell = row.getByRole('cell').nth(cellIndex)

  // Ensure cell is ready for interaction using semantic checks
  await expect(cell).toBeVisible()
  await expect(cell).toBeAttached()

  // Simple click - the waitForElementTableReady already ensures it's clickable
  await cell.click(clickOptions)
}


export async function debugTableLoadingState(page: Page, testId: string) {
  return await page.evaluate((testId) => {
    const table = document.querySelector(`[data-testid="${testId}"]`)
    if (!table) {
      console.log(`Table with testId "${testId}" not found`)
      return null
    }

    console.log(`\n=== Table ${testId} Loading State ===`)
    console.log('Table ARIA busy:', table.getAttribute('aria-busy'))
    console.log('Table classes:', table.className)

    // Check for loading indicators
    const loadingMask = table.querySelector('.el-loading-mask')
    const loadingSpinner = table.querySelector('.el-loading-spinner')

    // FIX: Use better visibility checks
    const isVisible = (element: Element | null): boolean => {
      if (!element) return false
      const htmlEl = element as HTMLElement
      return htmlEl.offsetParent !== null &&
        getComputedStyle(htmlEl).display !== 'none' &&
        getComputedStyle(htmlEl).visibility !== 'hidden'
    }

    console.log('Has loading mask:', !!loadingMask)
    console.log('Loading mask visible:', isVisible(loadingMask))
    console.log('Has loading spinner:', !!loadingSpinner)
    console.log('Loading spinner visible:', isVisible(loadingSpinner))

    // Check table content
    const rows = table.querySelectorAll('tbody tr')
    console.log('Table rows found:', rows.length)
    console.log('Table appears loaded:', rows.length > 0 && !isVisible(loadingMask))

    return {
      ariaBusy: table.getAttribute('aria-busy'),
      hasLoadingMask: !!loadingMask,
      loadingMaskVisible: isVisible(loadingMask),
      rowCount: rows.length,
      appearsLoaded: rows.length > 0 && !isVisible(loadingMask)
    }
  }, testId)
}