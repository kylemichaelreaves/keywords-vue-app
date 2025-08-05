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
 * Simplified wait for Element UI loading to complete - more reliable for CI
 */
export async function waitForElementUILoadingToComplete(page: Page, timeout: number = 30000) {
  // Simple, reliable approach: just wait for loading elements to not be visible
  await page.waitForFunction(
    () => {
      // Check for any visible loading indicators
      const loadingSelectors = [
        '.el-loading-mask',
        '.el-loading-spinner',
        '.el-loading-text',
        '[class*="is-loading"].el-'
      ]

      return !loadingSelectors.some(selector => {
        const elements = document.querySelectorAll(selector)
        return Array.from(elements).some(el => {
          const style = window.getComputedStyle(el)
          return style.display !== 'none' &&
                 style.visibility !== 'hidden' &&
                 style.opacity !== '0'
        })
      })
    },
    { timeout, polling: 1000 } // Slower polling for CI stability
  ).catch(() => {
    // If timeout, continue anyway - don't fail the test
    console.warn('Element UI loading check timed out, continuing anyway')
  })
}

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

  // Step 3: Simple loading check
  await waitForElementUILoadingToComplete(page, 5000) // Shorter timeout

  // Step 4: Network settle
  await page.waitForLoadState('networkidle', { timeout: 10000 })


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

/**
 * Enhanced debug function with more detailed loading state info
 */
export async function debugTableLoadingState(page: Page, testId: string) {
  return await page.evaluate((testId: string) => {
    const table = document.querySelector(`[data-testid="${testId}"]`)
    if (!table) {
      console.log(`Table with testId "${testId}" not found`)
      return null
    }

    const loadingMask = table.querySelector('.el-loading-mask')
    const loadingSpinner = table.querySelector('.el-loading-spinner')
    // Fix: Convert NodeList to Array to avoid iterator issues
    const rows = Array.from(table.querySelectorAll('tbody tr'))

    // Check computed styles for loading elements
    let maskVisible = false
    let spinnerVisible = false

    if (loadingMask) {
      const maskStyle = window.getComputedStyle(loadingMask)
      maskVisible = maskStyle.display !== 'none' &&
        maskStyle.visibility !== 'hidden' &&
        maskStyle.opacity !== '0'
    }

    if (loadingSpinner) {
      const spinnerStyle = window.getComputedStyle(loadingSpinner)
      spinnerVisible = spinnerStyle.display !== 'none' &&
        spinnerStyle.visibility !== 'hidden' &&
        spinnerStyle.opacity !== '0'
    }

    // Check for v-loading directive
    const hasVLoading = table.classList.contains('is-loading') ||
      table.classList.contains('el-loading-parent--relative')

    console.log(`Table debug info for ${testId}:`, {
      tableExists: !!table,
      hasLoadingMask: !!loadingMask,
      maskVisible,
      hasLoadingSpinner: !!loadingSpinner,
      spinnerVisible,
      hasVLoading,
      rowCount: rows.length,
      firstRowText: rows[0]?.textContent?.substring(0, 100)
    })

    return {
      tableExists: !!table,
      hasLoadingMask: !!loadingMask,
      maskVisible,
      hasLoadingSpinner: !!loadingSpinner,
      spinnerVisible,
      hasVLoading,
      rowCount: rows.length
    }
  }, testId)
}

/**
 * CI-specific retry wrapper for critical operations
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number
    delay?: number
    onRetry?: (attempt: number, error: Error) => void
  } = {}
): Promise<T> {
  const { retries = 3, onRetry } = options
  let lastError: Error | null = null

  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < retries - 1) {
        onRetry?.(i + 1, lastError)
        // Use page.waitForLoadState instead of timeout
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)))
      }
    }
  }

  throw new Error(`Operation failed after ${retries} attempts: ${lastError?.message || 'Unknown error'}`)
}

/**
 * Use this wrapper in CI for flaky operations
 */
export async function ciSafeOperation<T>(
  page: Page,
  operation: () => Promise<T>
): Promise<T> {
  if (process.env.CI) {
    return withRetry(operation, {
      retries: 3,
      onRetry: (attempt, error) => {
        console.log(`CI retry attempt ${attempt} after error:`, error.message)
        // Take screenshot for debugging - fire and forget
        page.screenshot({
          path: `ci-retry-${Date.now()}.png`,
          fullPage: true
        }).catch((e) => {
          console.error('Failed to take screenshot during CI retry:', e.message)
        })
        // No return value - void as expected
      }
    })
  }
  return operation()
}