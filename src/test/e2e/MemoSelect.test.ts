import { test, expect } from '@playwright/test'
import { staticTransactions } from '@test/e2e/mocks/transactionsMock'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock'
import { setupTransactionsTableWithComprehensiveMocks } from '@test/e2e/helpers/setupTestMocks'

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

  test('should update dropdown options when user types a search query', async ({ page }) => {
    // Wait for memo select to be ready
    const memoSelect = page.getByTestId('transactions-table-memo-select')
    await expect(memoSelect).toBeVisible({ timeout: 5000 })

    // Click the select to open it
    await memoSelect.click()

    // Get the input within the select (Element Plus creates an input for filtering)
    const selectInput = memoSelect.locator('input')
    await expect(selectInput).toBeVisible()

    // Type "Coffee" to filter - use type() instead of fill() for proper filtering
    // Element Plus needs keypress events to trigger filtering
    await selectInput.type('Coffee')

    // Wait for filtered options to appear by checking for the option
    const coffeeShopOption = page.getByRole('option', { name: 'Coffee Shop' }).first()
    await expect(coffeeShopOption).toBeVisible({ timeout: 5000 })

    // Verify we have Coffee-related options
    const coffeeOptions = page.getByRole('option', { name: /Coffee/i })
    const count = await coffeeOptions.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should select a memo from search results', async ({ page }) => {
    // Wait for memo select to be ready
    const memoSelect = page.getByTestId('transactions-table-memo-select')
    await expect(memoSelect).toBeVisible({ timeout: 5000 })

    // Click to open the select
    await memoSelect.click()

    // Type "Coffee" to filter - use type() for proper keypress events
    const selectInput = memoSelect.locator('input')
    await expect(selectInput).toBeVisible()
    await selectInput.type('Coffee Shop')

    // Wait for the option to be available before pressing Enter
    await expect(page.getByRole('option', { name: 'Coffee Shop' }).first()).toBeVisible({
      timeout: 5000,
    })

    // Press Enter to select the first filtered option
    await selectInput.press('Enter')

    // Verify selection - the select should now show "Coffee Shop"
    await expect(memoSelect).toContainText('Coffee Shop')
  })

  test('should clear selection when clear button is clicked', async ({ page }) => {
    // Wait for memo select to be ready
    const memoSelect = page.getByTestId('transactions-table-memo-select')
    await expect(memoSelect).toBeVisible({ timeout: 5000 })

    // First, select a memo
    await memoSelect.click()

    const selectInput = memoSelect.locator('input')
    await expect(selectInput).toBeVisible()
    await selectInput.type('Coffee Shop')

    // Wait for the option to be available before pressing Enter
    await expect(page.getByRole('option', { name: 'Coffee Shop' }).first()).toBeVisible({
      timeout: 5000,
    })

    // Press Enter to select the first filtered option
    await selectInput.press('Enter')

    // Verify selection
    await expect(memoSelect).toContainText('Coffee Shop')

    // Now clear the selection - hover to make the clear icon appear
    // Element Plus shows clear icon on hover when there's a selection
    await memoSelect.hover()

    // Find and click the clear icon within the select suffix area
    // Note: Element Plus uses internal CSS classes that may change in future versions
    // This clicks on the icon in the suffix area which becomes the clear button when hovered
    const clearIcon = memoSelect.locator('.el-select__suffix .el-icon')
    await expect(clearIcon).toBeVisible({ timeout: 2000 })
    await clearIcon.click()

    // Verify the selection is cleared - should show placeholder
    await expect(memoSelect).toContainText('Select a memo')
  })
})
