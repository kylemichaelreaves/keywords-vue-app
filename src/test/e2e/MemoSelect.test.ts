import { expect, test } from '@playwright/test'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'
import { AutocompleteComponent } from '@test/e2e/pages/components/AutocompleteComponent'
import {
  MEMO_SEARCH_DATASETS,
  mockMemoRoutes,
  mockTimeIntervalRoutes,
  mockTransactionRoutes,
} from '@test/e2e/helpers/setupTestMocks'
import type { Memo } from '@types'

test.describe('MemoSelect Search Functionality', () => {
  let transactionsPage: TransactionsPage
  let memoAutocomplete: AutocompleteComponent

  test.beforeEach(async ({ page }) => {
    // Setup page objects
    transactionsPage = new TransactionsPage(page)
    memoAutocomplete = new AutocompleteComponent(page, 'transactions-table-memo-select')

    // Setup mocking using helper functions with default dataset
    await mockMemoRoutes(page, { memos: MEMO_SEARCH_DATASETS.default as unknown as Memo[] })
    await mockTransactionRoutes(page)
    await mockTimeIntervalRoutes(page)

    // Navigate to page containing MemoSelect
    await transactionsPage.goto()
    await transactionsPage.waitForTransactionsTableReady()
  })

  test('should show prefetched options when component is entered', async ({ page }) => {
    // Click to activate the component
    // This should either show cached results or trigger a fetch
    await memoAutocomplete.click()

    // Wait a moment for the dropdown to appear and populate
    await page.waitForLoadState('domcontentloaded')

    // Verify the default suggestions are shown
    await memoAutocomplete.expectToHaveSuggestion('Groceries')
    await memoAutocomplete.expectToHaveSuggestion('Gas')
    await memoAutocomplete.expectToHaveSuggestion('Coffee')
  })

  test('should update dropdown options when user types a search query', async ({ page }) => {
    // First, unroute the existing mock and set up the new one with coffee data
    await page.unroute('**/api/**/memos*')
    await mockMemoRoutes(page, { memos: MEMO_SEARCH_DATASETS.coffee as unknown as Memo[] })

    // Click to activate the component
    await memoAutocomplete.click()

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )

    // Type the search query
    await memoAutocomplete.fill('Coffee')

    // Wait for the API response with the coffee search parameter
    await responsePromise

    // Verify the coffee-specific suggestions are shown
    await memoAutocomplete.expectToHaveSuggestion('Coffee Shop')
    await memoAutocomplete.expectToHaveSuggestion('Coffee Beans')
  })

  test('should handle rapid search query changes correctly', async ({ page }) => {
    // Setup gas-specific dataset for this test
    await page.unroute('**/api/**/memos*')
    await mockMemoRoutes(page, { memos: MEMO_SEARCH_DATASETS.gas as unknown as Memo[] })

    await memoAutocomplete.click()

    // Rapidly change search queries
    await memoAutocomplete.fill('G')

    await memoAutocomplete.fill('Ga')

    // Set up response waiter BEFORE the final fill that we want to wait for
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Gas'),
    )

    await memoAutocomplete.fill('Gas')

    // Wait for the final API request and suggestions
    await responsePromise

    // Should show results for "Gas", not intermediate queries
    await memoAutocomplete.expectToHaveSuggestion('Gas Station')
    await memoAutocomplete.expectToHaveSuggestion('Gas Utility')
  })

  test('should select a memo from search results', async ({ page }) => {
    await page.unroute('**/api/**/memos*')
    await mockMemoRoutes(page, { memos: MEMO_SEARCH_DATASETS.coffee as unknown as Memo[] })

    await memoAutocomplete.click()

    // Set up response waiter BEFORE the action that triggers it (avoid race condition in Firefox)
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )

    await memoAutocomplete.fill('Coffee')

    // Wait for the response we set up before filling
    await responsePromise

    // Select a suggestion using the page object
    await memoAutocomplete.selectSuggestion('Coffee Shop')

    // Verify the value is selected (dropdown closes after selection)
    await memoAutocomplete.expectValue('Coffee Shop')
  })

  test('should clear selection when clear button is clicked', async ({ page }) => {
    await page.unroute('**/api/**/memos*')
    await mockMemoRoutes(page, { memos: MEMO_SEARCH_DATASETS.coffee as unknown as Memo[] })

    // Select a value first
    await memoAutocomplete.click()

    // Set up response waiter BEFORE the action that triggers it
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )

    await memoAutocomplete.fill('Coffee')

    // Wait for response and suggestions to update
    await responsePromise
    // await memoAutocomplete.waitForSuggestionsToUpdate()

    await memoAutocomplete.selectSuggestion('Coffee Shop')

    // Verify value is selected
    await memoAutocomplete.expectValue('Coffee Shop')

    // Click clear button using page object
    await memoAutocomplete.clickClearButton()

    // Verify value is cleared
    await memoAutocomplete.expectToBeEmpty()
  })

  test('should show empty state when no results match', async ({ page }) => {
    // Setup empty dataset for this test
    await page.unroute('**/api/**/memos*')
    await mockMemoRoutes(page, { memos: MEMO_SEARCH_DATASETS.empty as unknown as Memo[] })

    // await page.waitForResponse((response) => response.url().includes('/memos'))

    await memoAutocomplete.click()
    await memoAutocomplete.fill('NonexistentMemo')

    // Check if dropdown is hidden or shows "No data" message
    const isDropdownVisible = await memoAutocomplete.isDropdownVisible()

    if (isDropdownVisible) {
      // If dropdown is visible, it should be empty or show a no-data message
      const suggestionCount = await memoAutocomplete.getSuggestionCount()
      expect(suggestionCount).toBe(0)
    } else {
      // Dropdown is hidden, which is also acceptable for empty results
      expect(isDropdownVisible).toBe(false)
    }
  })
})

test.describe('MemoSelect Integration with Transactions', () => {
  test.skip('should filter transactions table when memo is selected', async ({ page }) => {
    const transactionsPage = new TransactionsPage(page)
    const memoAutocomplete = new AutocompleteComponent(page, 'transactions-table-memo-select')

    // Setup mocking
    await mockMemoRoutes(page)
    await mockTransactionRoutes(page)
    await mockTimeIntervalRoutes(page)

    // Navigate and wait for page to be ready
    await transactionsPage.goto()

    const responsePromise = page.waitForResponse((response) => response.url().includes('/memos'))

    // Search and select a memo
    await memoAutocomplete.click()

    // Set up response waiter BEFORE the action

    await memoAutocomplete.fill('Coffee')

    await responsePromise

    await memoAutocomplete.selectSuggestion('Coffee Shop')

    await expect(transactionsPage.transactionsTable).toBeVisible()

    // Verify memo is selected
    await memoAutocomplete.expectValue('Coffee Shop')
  })
})
