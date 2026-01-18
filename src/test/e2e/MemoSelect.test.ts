import { test, expect } from '@playwright/test'
import { staticTransactions } from '@test/e2e/mocks/transactionsMock'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock'
import { setupTransactionsTableWithComprehensiveMocks } from '@test/e2e/helpers/setupTestMocks'
import type { Page, Locator } from '@playwright/test'

const isCI = !!process.env.CI

test.describe('MemoSelect Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Setup comprehensive mocks before navigation (same as TransactionsTable test)
    await setupTransactionsTableWithComprehensiveMocks(
      page,
      staticTransactions.reverse(),
      staticDailyIntervals,
    )

    // Navigate to the transactions page which has the MemoSelect component
    await page.goto('/budget-visualizer/transactions')

    // Wait for page to be ready
    await page.waitForLoadState('domcontentloaded')
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    // Wait for the transactions table selects container to be visible
    await page.waitForSelector('[data-testid="transactions-table-selects"]', {
      timeout: isCI ? 30000 : 15000,
    })

    // Wait for the memo select to be visible
    await page.waitForSelector('[data-testid="transactions-table-memo-select"]', {
      timeout: isCI ? 30000 : 15000,
    })
  })

  // Helper function to get memo select and ensure it's visible
  async function getMemoSelect(page: Page): Promise<Locator> {
    const memoSelect = page.getByTestId('transactions-table-memo-select')
    await expect(memoSelect).toBeVisible({ timeout: 5000 })
    return memoSelect
  }

  // Helper function to open select and get input
  async function openSelectAndGetInput(memoSelect: Locator): Promise<Locator> {
    await memoSelect.click()
    const selectInput = memoSelect.locator('input')
    await expect(selectInput).toBeVisible()
    return selectInput
  }

  // Helper function to search and wait for options
  async function searchMemo(page: Page, selectInput: Locator, searchText: string): Promise<void> {
    await selectInput.fill(searchText)

    // Wait for first matching option to appear
    const firstOption = page.getByRole('option', { name: searchText }).first()
    await expect(firstOption).toBeVisible({ timeout: 5000 })
  }

  // Helper function to select a memo by searching and pressing Enter
  async function selectMemoBySearch(
    page: Page,
    memoSelect: Locator,
    searchText: string,
  ): Promise<void> {
    const selectInput = await openSelectAndGetInput(memoSelect)
    await selectInput.type(searchText)

    await expect(page.getByRole('option', { name: searchText }).first()).toBeVisible({
      timeout: 5000,
    })

    await selectInput.press('Enter')
  }

  test('should update dropdown options when user types a search query', async ({ page }) => {
    const memoSelect = await getMemoSelect(page)
    const selectInput = await openSelectAndGetInput(memoSelect)

    await searchMemo(page, selectInput, 'Coffee')

    // Verify we have Coffee-related options
    const coffeeOptions = page.getByRole('option', { name: /Coffee/i })
    const count = await coffeeOptions.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should select a memo from search results', async ({ page }) => {
    const memoSelect = await getMemoSelect(page)

    await selectMemoBySearch(page, memoSelect, 'Coffee Shop')

    // Verify selection - the select should now show "Coffee Shop"
    await expect(memoSelect).toContainText('Coffee Shop')
  })

  test('should clear selection when clear button is clicked', async ({ page }) => {
    const memoSelect = await getMemoSelect(page)

    // First, select a memo
    await selectMemoBySearch(page, memoSelect, 'Coffee Shop')

    // Verify selection
    await expect(memoSelect).toContainText('Coffee Shop')

    // Now clear the selection - hover to make the clear icon appear
    await memoSelect.hover()

    // Find and click the clear icon
    const clearIcon = memoSelect.locator('.el-select__suffix .el-icon')
    await expect(clearIcon).toBeVisible({ timeout: 2000 })
    await clearIcon.click()

    // Verify the selection is cleared - should show placeholder
    await expect(memoSelect).toContainText('Select a memo')
  })
})
