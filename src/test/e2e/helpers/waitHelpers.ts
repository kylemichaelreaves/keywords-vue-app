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
 * Ultra-simplified wait for Element UI loading - CI focused
 */
export async function waitForElementUILoadingToComplete(page: Page, timeout: number = 10000) {
  // Most basic approach: just check if any loading masks exist and are visible
  try {
    await page.waitForFunction(
      () => {
        const masks = document.querySelectorAll('.el-loading-mask')
        return masks.length === 0 || Array.from(masks).every(mask => {
          const style = window.getComputedStyle(mask)
          return style.display === 'none' || style.opacity === '0'
        })
      },
      { timeout, polling: 2000 } // Even slower polling - 2 seconds
    )
  } catch {
    // Always continue - never fail the test on loading timeout
    // This is just a best-effort helper
  }
}

/**
 * Specific helper to wait for Element UI spinners to be hidden
 */
export async function waitForSpinnersToDisappear(page: Page, timeout: number = 60000) {
  try {
    // Wait for all loading elements to be hidden or removed
    await page.waitForFunction(
      () => {
        // Check for loading masks
        const masks = document.querySelectorAll('.el-loading-mask')
        const maskHidden = masks.length === 0 || Array.from(masks).every(mask => {
          const style = window.getComputedStyle(mask)
          return style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.opacity === '0' ||
            !document.body.contains(mask)
        })

        // Check for loading spinners
        const spinners = document.querySelectorAll('.el-loading-spinner')
        const spinnersHidden = spinners.length === 0 || Array.from(spinners).every(spinner => {
          const style = window.getComputedStyle(spinner)
          return style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.opacity === '0' ||
            !document.body.contains(spinner)
        })

        // Check for v-loading directive elements
        const loadingElements = document.querySelectorAll('[class*="is-loading"]')
        const vLoadingHidden = Array.from(loadingElements).every(el => {
          return !el.classList.contains('is-loading') ||
            !el.className.includes('el-')
        })

        return maskHidden && spinnersHidden && vLoadingHidden
      },
      { timeout, polling: 1000 } // Check every second
    )
  } catch (error) {
    console.warn('Spinner wait timed out, continuing anyway:', error)
    // Don't fail the test - just continue
  }
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


  await table.locator('.el-loading-mask').waitFor({ state: 'hidden', timeout: 10000 })


  // Double-check no loading masks are present on the table specifically
  await expect(table.locator('.el-loading-mask')).not.toBeVisible()
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
 * Wait for ALL loading spinners to be hidden
 * @param {Page} page - Playwright page object
 */
export async function getSpinnerInfo(page: Page) {
  return await page.evaluate(() => {
    const masks = Array.from(document.querySelectorAll('.el-loading-mask'))

    // Filter to only visible masks
    const visibleMasks = masks.filter(mask => {
      const style = window.getComputedStyle(mask)
      return style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        (mask as HTMLElement).offsetParent !== null
    })

    // Get info about what elements they're on top of
    const containers = visibleMasks.map(mask => {
      const parent = mask.parentElement
      if (!parent) return 'unknown'

      // Try to get a meaningful identifier
      const id = parent.id ? `#${parent.id}` : ''
      const classes = parent.className ? `.${parent.className.split(' ').join('.')}` : ''
      const testId = parent.getAttribute('data-testid') ? `[data-testid="${parent.getAttribute('data-testid')}"]` : ''
      const tagName = parent.tagName.toLowerCase()

      // Return the most specific identifier available
      return testId || id || classes || tagName
    })

    return {
      count: visibleMasks.length,
      containers: containers
    }
  })
}


export async function waitForAllSpinnersHidden(page: Page, options: { timeout?: number; debug?: boolean } = {}) {
  const { timeout = 30000, debug = false } = options

  if (debug) {
    const initial = await getSpinnerInfo(page)
    console.log(`Waiting for ${initial.count} spinner(s) to disappear from:`, initial.containers)
  }

  await page.waitForFunction(() => {
    const masks = Array.from(document.querySelectorAll('.el-loading-mask'))
    const visibleMasks = masks.filter(mask => {
      const style = window.getComputedStyle(mask)
      return style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        (mask as HTMLElement).offsetParent !== null
    })

    return visibleMasks.length === 0
  }, { timeout })

  if (debug) {
    console.log('All spinners hidden')
  }
}


export async function logSpinnersAndWait(page: Page, options: { timeout?: number; debug?: boolean } = {}) {
  const spinnerInfo = await getSpinnerInfo(page)

  console.log(`Found ${spinnerInfo.count} active spinner(s):`)
  spinnerInfo.containers.forEach((container, index) => {
    console.log(`  ${index + 1}. ${container}`)
  })

  if (spinnerInfo.count > 0) {
    console.log('Waiting for all spinners to disappear...')
    await waitForAllSpinnersHidden(page, options)
    console.log('All spinners are now hidden')
  } else {
    console.log('No spinners found')
  }
}
