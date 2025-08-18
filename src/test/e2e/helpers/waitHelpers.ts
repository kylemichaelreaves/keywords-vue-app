// waitHelpers.ts
import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

const isCI = !!process.env.CI

// Debug logging helper for CI
async function debugLog(page: Page, message: string, data?: any) {
  if (isCI) {
    console.log(`[CI DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '')
    // Also log to browser console for trace collection
    await page.evaluate((msg) => console.log(`[CI DEBUG] ${msg}`), message + (data ? ` ${JSON.stringify(data)}` : ''))
  }
}

// Enhanced error context for CI failures
async function capturePageState(page: Page, context: string) {
  if (isCI) {
    try {
      const url = page.url()
      const title = await page.title()
      const loadState = await page.evaluate(() => document.readyState)
      const networkRequests = await page.evaluate(() => {
        return Array.from(performance.getEntriesByType('navigation')).map(entry => ({
          name: entry.name,
          duration: entry.duration,
          loadEventEnd: (entry as PerformanceNavigationTiming).loadEventEnd
        }))
      })

      console.log(`[CI STATE] ${context}:`, {
        url,
        title,
        loadState,
        networkRequests,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.log(`[CI STATE ERROR] Failed to capture state for ${context}:`, error)
    }
  }
}

/**
 * Wait for Element UI table to be fully loaded and interactive
 * Enhanced version with better loading detection and CI debugging
 */
export async function waitForElementTableReady(table: Locator, page: Page, options: {
  timeout?: number
  minRows?: number
} = {}) {
  const { timeout = isCI ? 60000 : 30000 } = options

  await debugLog(page, 'Starting table ready wait', { timeout, isCI })
  await capturePageState(page, 'Before table wait')

  try {
    await expect(table).toBeVisible({ timeout })
    await debugLog(page, 'Table is visible')

    await expect(table.getByRole('row').first()).toBeVisible({ timeout })
    await debugLog(page, 'First row is visible')

    await expect(table.getByRole('cell').first()).toBeVisible({ timeout })
    await debugLog(page, 'First cell is visible')

    // Wait for network idle with longer timeout in CI
    await page.waitForLoadState('networkidle', { timeout: isCI ? 20000 : 10000 })
    await debugLog(page, 'Network idle achieved')

    await capturePageState(page, 'After table ready')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    await capturePageState(page, 'Table ready failed')
    await debugLog(page, 'Table ready failed', { error: errorMessage })
    throw error
  }
}

/**
 * Safe table row interaction with comprehensive Element UI support
 */
export async function rightClickElementTableRow(table: Locator, page: Page, rowIndex: number = 0) {
  await debugLog(page, 'Starting right click on table row', { rowIndex })

  // Comprehensive table ready check including Element UI loading
  await waitForElementTableReady(table, page)

  const tableRow = table.getByRole('row').nth(rowIndex)

  // Ensure row is ready for interaction
  await expect(tableRow).toBeVisible()
  await expect(tableRow).toBeAttached()

  // Ensure row has content
  await expect(tableRow.getByRole('cell').first()).not.toBeEmpty()

  // Right click with force option for CI stability
  await tableRow.click({ button: 'right', force: isCI })
  await debugLog(page, 'Right click completed')
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
  await debugLog(page, 'Starting cell click', { rowIndex, cellIndex, clickOptions })

  await waitForElementTableReady(table, page)

  const row = table.getByRole('row').nth(rowIndex)
  const cell = row.getByRole('cell').nth(cellIndex)

  await expect(cell).toBeVisible()
  await expect(cell).toBeAttached()

  await cell.click({ ...clickOptions, force: isCI })
  await debugLog(page, 'Cell click completed')
}

/**
 * Wait for table to have actual data content instead of loading states
 */
export async function waitForTableContent(table: Locator, page: Page, options: {
  minRows?: number
  timeout?: number
} = {}) {
  const { minRows = 1, timeout = isCI ? 90000 : 60000 } = options

  await debugLog(page, 'Starting table content wait', { minRows, timeout })
  await capturePageState(page, 'Before table content wait')

  try {
    // Wait for table to exist
    await table.waitFor({ state: 'visible', timeout })
    await debugLog(page, 'Table exists and is visible')

    // Wait for loading states to clear (Element UI specific)
    await page.waitForTimeout(isCI ? 2000 : 500)

    // Ensure first data row has content
    const firstDataRow = table.getByRole('row').nth(1) // Skip header row
    await expect(firstDataRow.getByRole('cell').first()).not.toBeEmpty({ timeout })
    await debugLog(page, 'First data row has content')

    // Additional check for Element UI table loading states
    await page.waitForSelector('.el-loading-mask', { state: 'hidden', timeout: 5000 }).catch(() => {
      // Ignore if loading mask doesn't exist
    })

    // Wait for network to settle (no more pending requests)
    await page.waitForLoadState('domcontentloaded', { timeout: isCI ? 90000 : 60000 })
    await debugLog(page, 'DOM content loaded')

    // Extra wait for CI stability
    if (isCI) {
      await page.waitForTimeout(1000)
    }

    await capturePageState(page, 'After table content ready')
  } catch (error) {
    await capturePageState(page, 'Table content wait failed')
    const errorMessage = error instanceof Error ? error.message : String(error)
    await debugLog(page, 'Table content wait failed', { error: errorMessage })

    // Capture additional debugging info on failure
    try {
      const rowCount = await table.getByRole('row').count()
      const cellCount = await table.getByRole('cell').count()
      await debugLog(page, 'Table state on failure', { rowCount, cellCount })
    } catch (debugError) {
      const debugErrorMessage = debugError instanceof Error ? debugError.message : String(debugError)
      await debugLog(page, 'Failed to capture debug info', { debugError: debugErrorMessage })
    }

    throw error
  }
}

export async function rightClickAndOpenDialog(
  page: Page,
  targetSelector: string,
  options: { timeout?: number } = {}
) {
  const { timeout = isCI ? 30000 : 15000 } = options

  await debugLog(page, 'Starting right click and open dialog', { targetSelector, timeout })

  try {
    // Right-click on target - this directly opens the dialog
    await page.locator(targetSelector).click({ button: 'right', force: isCI })
    await debugLog(page, 'Right click completed')

    // Wait for dialog to appear
    await page.getByRole('dialog').waitFor({ timeout })
    await debugLog(page, 'Dialog appeared')

    // Wait for form inside dialog to be ready
    await page.getByRole('dialog').locator('form').waitFor({ timeout: isCI ? 10000 : 5000 })
    await debugLog(page, 'Dialog form ready')
  } catch (error) {
    await capturePageState(page, 'Right click dialog failed')
    throw error
  }
}

/**
 * Wait for line chart to be fully loaded with data points
 */
export async function waitForLineChartReady(chartContainer: Locator, page: Page, options: {
  timeout?: number
  minDataPoints?: number
} = {}) {
  const { timeout = isCI ? 30000 : 15000, minDataPoints = 1 } = options

  await debugLog(page, 'Starting line chart ready wait', { timeout, minDataPoints })
  await capturePageState(page, 'Before chart wait')

  try {
    // Wait for chart container to be visible
    await expect(chartContainer).toBeVisible({ timeout })
    await debugLog(page, 'Chart container is visible')

    // Wait for SVG element to be present - use the correct selector
    const svg = chartContainer.locator('svg[data-testid="line-chart"]')
    await expect(svg).toBeVisible({ timeout })
    await debugLog(page, 'Chart SVG is visible')

    // Wait for at least one chart dot to be rendered
    const firstDot = chartContainer.getByTestId('chart-dot-0')
    await expect(firstDot).toBeVisible({ timeout })
    await debugLog(page, 'First chart dot is visible')

    // Wait for minimum number of data points
    if (minDataPoints > 1) {
      for (let i = 1; i < minDataPoints; i++) {
        const dot = chartContainer.getByTestId(`chart-dot-${i}`)
        await expect(dot).toBeVisible({ timeout: timeout / minDataPoints })
        await debugLog(page, `Chart dot ${i} is visible`)
      }
    }

    // Wait for network to settle with CI-appropriate timeout
    await page.waitForLoadState('networkidle', { timeout: isCI ? 10000 : 5000 })
    await debugLog(page, 'Chart network idle achieved')

    // Extra stability wait for CI
    if (isCI) {
      await page.waitForTimeout(1000)
    }

    await capturePageState(page, 'After chart ready')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    await capturePageState(page, 'Chart ready failed')
    await debugLog(page, 'Chart ready failed', { error: errorMessage })

    // Capture chart-specific debugging info
    try {
      const dotCount = await chartContainer.getByTestId(/chart-dot-\d+/).count()
      const svgExists = await chartContainer.locator('svg[data-testid="line-chart"]').count()
      await debugLog(page, 'Chart state on failure', { dotCount, svgExists })
    } catch (debugError) {
      const debugErrorMessage = debugError instanceof Error ? debugError.message : String(debugError)
      await debugLog(page, 'Failed to capture chart debug info', { debugError: debugErrorMessage })
    }

    throw error
  }
}
