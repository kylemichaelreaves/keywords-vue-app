import { test, expect } from '@playwright/test'
import { generateMemosArray } from '@test/e2e/mocks/memosMock'
import { staticTransactions } from '@test/e2e/mocks/transactionsMock'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock'
import { setupTransactionsTableWithComprehensiveMocks } from '@test/e2e/helpers/setupTestMocks'

const isCI = !!process.env.CI

test.describe('MemoSelect Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Setup comprehensive mocks before navigation (same as TransactionsTable test)
    await setupTransactionsTableWithComprehensiveMocks(page, staticTransactions.reverse(), staticDailyIntervals)
    
    // Navigate to the transactions page which has the MemoSelect component
    await page.goto('/budget-visualizer/transactions')
    
    // Wait for page to be ready
    await page.waitForLoadState('domcontentloaded')
    await page.waitForLoadState('networkidle', { timeout: 10000 })
    
    // Wait for the transactions table selects container to be visible
    await page.waitForSelector('[data-testid="transactions-table-selects"]', { 
      timeout: isCI ? 30000 : 15000 
    })
    
    // Wait for the memo select to be visible
    await page.waitForSelector('[data-testid="transactions-table-memo-select"]', { 
      timeout: isCI ? 30000 : 15000 
    })
  })

  test('should update dropdown options when user types a search query', async ({ page }) => {
    // Wait for memo select to be ready
    const memoSelect = page.getByTestId('transactions-table-memo-select')
    await expect(memoSelect).toBeVisible({ timeout: 5000 })
    
    // Click the select to open it
    await memoSelect.click()
    
    // Wait a bit for dropdown to open
    await page.waitForTimeout(500)
    
    // Get the input within the select (Element Plus creates an input for filtering)
    const selectInput = memoSelect.locator('input')
    
    // Type "Coffee" to filter - use type() instead of fill() for proper filtering
    // Element Plus needs keypress events to trigger filtering
    await selectInput.type('Coffee')
    
    // Wait a bit for filtering to complete
    await page.waitForTimeout(800)
    
    // Verify filtered options are displayed
    // After typing "Coffee", we should see "Coffee Shop" option
    // Note: There may be multiple "Coffee Shop" entries due to random generation
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
    await page.waitForTimeout(500)
    
    // Type "Coffee" to filter - use type() for proper keypress events
    const selectInput = memoSelect.locator('input')
    await selectInput.type('Coffee Shop')
    await page.waitForTimeout(800)
    
    // Instead of clicking, press Enter to select the first filtered option
    await selectInput.press('Enter')
    
    // Wait for selection to be applied
    await page.waitForTimeout(500)
    
    // Verify selection - the select should now show "Coffee Shop"
    await expect(memoSelect).toContainText('Coffee Shop')
  })

  test('should clear selection when clear button is clicked', async ({ page }) => {
    // Wait for memo select to be ready
    const memoSelect = page.getByTestId('transactions-table-memo-select')
    await expect(memoSelect).toBeVisible({ timeout: 5000 })
    
    // First, select a memo
    await memoSelect.click()
    await page.waitForTimeout(500)
    
    const selectInput = memoSelect.locator('input')
    await selectInput.type('Coffee Shop')
    await page.waitForTimeout(800)
    
    // Press Enter to select the first filtered option
    await selectInput.press('Enter')
    
    // Wait for selection to be applied
    await page.waitForTimeout(500)
    
    // Verify selection
    await expect(memoSelect).toContainText('Coffee Shop')
    
    // Now clear the selection - hover to make the clear icon appear
    // Element Plus shows clear icon on hover when there's a selection
    await memoSelect.hover()
    await page.waitForTimeout(300)
    
    // Find and click the clear icon within the select suffix area
    // Note: Element Plus uses internal CSS classes that may change in future versions
    // This clicks on the icon in the suffix area which becomes the clear button when hovered
    const clearIcon = memoSelect.locator('.el-select__suffix .el-icon')
    await clearIcon.click()
    
    // Verify the selection is cleared - should show placeholder
    await page.waitForTimeout(500)
    await expect(memoSelect).toContainText('Select a memo')
  })
})
