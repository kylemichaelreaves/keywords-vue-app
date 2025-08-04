import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Comprehensive wait strategy for CI environments
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle')
}

/**
 * Wait for a table to be fully loaded and interactive
 */
export async function waitForTableReady(table: Locator) {
  await expect(table).toBeVisible()

  const tableBody = table.locator('tbody')
  await expect(tableBody).toBeVisible()

  // Ensure at least one row exists and is interactive
  const firstRow = tableBody.locator('tr').first()
  await expect(firstRow).toBeVisible()
  await expect(firstRow).toBeAttached()

  // Wait for row content to be loaded (not just empty cells)
  await expect(firstRow.locator('td').first()).toBeVisible()

  // Ensure table is not in a loading state
  await expect(table).not.toHaveClass(/loading|skeleton/)
}

/**
 * Wait for element to be interactive (visible, attached, and ready for clicks)
 */
export async function waitForElementInteractive(element: Locator) {
  await expect(element).toBeVisible()
  await expect(element).toBeAttached()
  await expect(element).toBeEnabled()

  // Ensure element is not in loading/disabled state
  await expect(element).not.toHaveClass(/loading|disabled|pending/)
}

/**
 * Safe navigation with proper waits
 */
export async function navigateAndWait(page: Page, url: string | RegExp, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }) {
  await page.waitForURL(url, { waitUntil: options?.waitUntil || 'networkidle' })
  await waitForPageReady(page)
}

/**
 * Wait for dropdown options to be available
 */
export async function waitForDropdownOptions(page: Page) {
  await page.getByRole('option').first().waitFor({ state: 'visible' })
}

/**
 * Wait for dropdown to be ready with options loaded
 */
export async function waitForDropdownReady(dropdown: Locator, page: Page) {
  await expect(dropdown).toBeVisible()
  await expect(dropdown).toBeEnabled()

  // Click to open dropdown
  await dropdown.click()

  // Wait for options to be available
  await expect(page.getByRole('option').first()).toBeVisible()

  // Ensure options have loaded (not just loading placeholders)
  const firstOption = page.getByRole('option').first()
  await expect(firstOption).not.toHaveText(/loading|\.\.\./)
}

/**
 * Wait for modal to be fully ready for interaction
 */
export async function waitForModalReady(modal: Locator) {
  await expect(modal).toBeVisible()

  // Wait for modal content to be loaded
  const modalContent = modal.locator('[role="dialog"], .modal-content, .dialog-content').first()
  await expect(modalContent).toBeVisible()

  // Ensure modal is not in loading state
  await expect(modal).not.toHaveClass(/loading|opening/)
}

/**
 * Robust table row interaction with proper waits
 */
export async function rightClickTableRow(table: Locator, rowIndex: number = 0) {
  await waitForTableReady(table)

  const tableRow = table.locator('tbody tr').nth(rowIndex)
  await waitForElementInteractive(tableRow)

  // Ensure row has actual content before clicking
  await expect(tableRow.locator('td').first()).not.toBeEmpty()

  await tableRow.click({ button: 'right' })
}
