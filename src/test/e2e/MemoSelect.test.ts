import { test, expect } from '@playwright/test'
import { staticTransactions } from '@test/e2e/mocks/transactionsMock'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock'
import { setupTransactionsTableWithComprehensiveMocks } from '@test/e2e/helpers/setupTestMocks'
import { AutocompleteComponent } from '@test/e2e/pages/components/AutocompleteComponent'

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

    // Wait for the memo select to be visible
    await page.getByTestId('transactions-table-memo-select').waitFor({
      state: 'visible',
      timeout: isCI ? 30000 : 15000,
    })
  })

  test('should display dropdown options when focused', async ({ page }) => {
    const memoSelect = new AutocompleteComponent(page, 'transactions-table-memo-select')

    // Click to focus
    await memoSelect.click()

    // Wait for suggestions to appear (dropdown opens and options are visible)
    await memoSelect.waitForSuggestions()

    // Verify we have some suggestions
    const suggestionCount = await memoSelect.getSuggestionCount()
    expect(suggestionCount).toBeGreaterThan(0)
  })

  test('pressing escape should close the dropdown', async ({ page }) => {
    const memoSelect = new AutocompleteComponent(page, 'transactions-table-memo-select')

    // Click to focus
    await memoSelect.click()

    // Wait for suggestions to appear
    await memoSelect.waitForSuggestions()

    // Press Escape to close the dropdown
    await page.keyboard.press('Escape')

    // Wait for the dropdown to become hidden using Playwright's auto-retry assertion
    // This is more reliable than checking visibility immediately
    await expect(memoSelect.dropdown).not.toBeVisible({ timeout: 5000 })
  })

  test('should update dropdown options when user types a search query', async ({ page }) => {
    const memoSelect = new AutocompleteComponent(page, 'transactions-table-memo-select')

    // Click to focus
    await memoSelect.click()

    // Wait for dropdown to open first
    await memoSelect.waitForSuggestions()

    // Type search text
    await memoSelect.fill('Coffee')

    // Wait for filtered suggestions to appear
    await memoSelect.waitForSuggestions()

    // Verify we have Coffee-related options
    const suggestionCount = await memoSelect.getSuggestionCount()
    expect(suggestionCount).toBeGreaterThan(0)

    // Verify a Coffee option exists
    await memoSelect.expectToHaveSuggestion('Coffee')
  })

  test('should select a memo from search results', async ({ page }) => {
    const memoSelect = new AutocompleteComponent(page, 'transactions-table-memo-select')

    // Click to focus and type search text
    await memoSelect.click()

    // Wait for suggestions and select
    await memoSelect.selectSuggestion('Coffee Shop')

    // Verify selection - the input should now show "Coffee Shop"
    await memoSelect.expectValue('Coffee Shop')
  })

  test('should clear selection when clear button is clicked', async ({ page }) => {
    const memoSelect = new AutocompleteComponent(page, 'transactions-table-memo-select')

    // First, select a memo
    await memoSelect.click()

    await memoSelect.selectSuggestion('Coffee Shop')

    // Verify selection
    await memoSelect.expectValue('Coffee Shop')

    // Clear the selection using the page object method
    await memoSelect.clickClearButton()

    // Verify the selection is cleared
    await memoSelect.expectToBeEmpty()
  })
})
