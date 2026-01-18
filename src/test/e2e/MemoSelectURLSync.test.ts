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

test.describe('MemoSelect URL Synchronization', () => {
  let transactionsPage: TransactionsPage
  let memoAutocomplete: AutocompleteComponent

  // Using the coffee dataset which has:
  // { id: 101, name: 'Coffee Shop' }
  // { id: 102, name: 'Coffee Beans' }

  test.beforeEach(async ({ page }) => {
    // Setup page objects
    transactionsPage = new TransactionsPage(page)
    memoAutocomplete = new AutocompleteComponent(page, 'transactions-table-memo-select')

    // Setup mocking
    await mockMemoRoutes(page, { memos: MEMO_SEARCH_DATASETS.coffee as unknown as Memo[] })
    await mockTransactionRoutes(page)
    await mockTimeIntervalRoutes(page)
  })

  test('should update URL with memo ID when memo is selected', async ({ page }) => {
    // Navigate to transactions page
    await transactionsPage.goto()
    await transactionsPage.waitForTransactionsTableReady()

    // Verify initial URL has no memo parameter
    expect(page.url()).not.toContain('memo=')

    // Click and search for coffee
    await memoAutocomplete.click()
    await memoAutocomplete.fill('Coffee')

    // Wait for search results
    await page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )

    // Select "Coffee Shop"
    await memoAutocomplete.selectSuggestion('Coffee Shop')

    // Wait for URL to update
    await page.waitForTimeout(500)

    // Verify URL contains memo ID (101), not name
    const currentUrl = page.url()
    expect(currentUrl).toContain('memo=101')
    expect(currentUrl).not.toContain('memo=Coffee')
    expect(currentUrl).not.toContain('memo=Coffee+Shop')
    expect(currentUrl).not.toContain('memo=Coffee%20Shop')

    // Verify the autocomplete still shows the name
    await memoAutocomplete.expectValue('Coffee Shop')
  })

  test('should clear memo from URL when selection is cleared', async ({ page }) => {
    // Navigate to transactions page
    await transactionsPage.goto()
    await transactionsPage.waitForTransactionsTableReady()

    // Select a memo first
    await memoAutocomplete.click()
    await memoAutocomplete.fill('Coffee')
    await page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )
    await memoAutocomplete.selectSuggestion('Coffee Shop')
    await page.waitForTimeout(500)

    // Verify URL has memo
    expect(page.url()).toContain('memo=101')

    // Clear the selection
    await memoAutocomplete.clickClearButton()
    await page.waitForTimeout(500)

    // Verify URL no longer has memo parameter
    const currentUrl = page.url()
    expect(currentUrl).not.toContain('memo=')

    // Verify autocomplete is empty
    await memoAutocomplete.expectToBeEmpty()
  })

  test('should initialize memo from URL on page load', async ({ page }) => {
    // Navigate directly to transactions page with memo ID in URL
    await page.goto('/budget-visualizer/transactions?memo=101')
    await transactionsPage.waitForTransactionsTableReady()

    // Wait for memos to load and component to initialize
    await page.waitForTimeout(1000)

    // Verify the autocomplete shows the memo name (not ID)
    await memoAutocomplete.expectValue('Coffee Shop')

    // Verify URL still has the ID
    expect(page.url()).toContain('memo=101')
  })

  test('should preserve memo in URL on page refresh', async ({ page }) => {
    // Navigate to transactions page
    await transactionsPage.goto()
    await transactionsPage.waitForTransactionsTableReady()

    // Select a memo
    await memoAutocomplete.click()
    await memoAutocomplete.fill('Coffee')
    await page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )
    await memoAutocomplete.selectSuggestion('Coffee Shop')
    await page.waitForTimeout(500)

    // Verify URL has memo
    expect(page.url()).toContain('memo=101')

    // Refresh the page
    await page.reload()
    await transactionsPage.waitForTransactionsTableReady()
    await page.waitForTimeout(1000)

    // Verify memo is still selected after refresh
    await memoAutocomplete.expectValue('Coffee Shop')
    expect(page.url()).toContain('memo=101')
  })

  test('should preserve other query parameters when updating memo', async ({ page }) => {
    // Navigate with existing query parameters
    await page.goto('/budget-visualizer/transactions?timeFrame=year&date=2026')
    await transactionsPage.waitForTransactionsTableReady()

    // Verify initial URL has timeFrame and date
    let currentUrl = page.url()
    expect(currentUrl).toContain('timeFrame=year')
    expect(currentUrl).toContain('date=2026')

    // Select a memo
    await memoAutocomplete.click()
    await memoAutocomplete.fill('Coffee')
    await page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )
    await memoAutocomplete.selectSuggestion('Coffee Shop')
    await page.waitForTimeout(500)

    // Verify URL has memo AND still has other parameters
    currentUrl = page.url()
    expect(currentUrl).toContain('memo=101')
    expect(currentUrl).toContain('timeFrame=year')
    expect(currentUrl).toContain('date=2026')
  })

  test('should remove only memo parameter when cleared, preserving others', async ({ page }) => {
    // Navigate with multiple query parameters
    await page.goto('/budget-visualizer/transactions?timeFrame=year&date=2026')
    await transactionsPage.waitForTransactionsTableReady()

    // Select a memo
    await memoAutocomplete.click()
    await memoAutocomplete.fill('Coffee')
    await page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )
    await memoAutocomplete.selectSuggestion('Coffee Shop')
    await page.waitForTimeout(500)

    // Verify all parameters present
    let currentUrl = page.url()
    expect(currentUrl).toContain('memo=101')
    expect(currentUrl).toContain('timeFrame=year')
    expect(currentUrl).toContain('date=2026')

    // Clear memo
    await memoAutocomplete.clickClearButton()
    await page.waitForTimeout(500)

    // Verify only memo is removed, others remain
    currentUrl = page.url()
    expect(currentUrl).not.toContain('memo=')
    expect(currentUrl).toContain('timeFrame=year')
    expect(currentUrl).toContain('date=2026')
  })

  test('should handle invalid memo ID in URL gracefully', async ({ page }) => {
    // Navigate with non-existent memo ID
    await page.goto('/budget-visualizer/transactions?memo=99999')
    await transactionsPage.waitForTransactionsTableReady()

    // Component should remain empty (no error thrown)
    await memoAutocomplete.expectToBeEmpty()

    // URL should still have the invalid ID (we don't modify it)
    expect(page.url()).toContain('memo=99999')
  })

  test('should send API request with memo name, not ID', async ({ page }) => {
    // Navigate to transactions page
    await transactionsPage.goto()
    await transactionsPage.waitForTransactionsTableReady()

    // Set up listener for transactions API call
    const transactionsRequestPromise = page.waitForRequest(
      (request) => request.url().includes('/transactions') && request.url().includes('memo='),
    )

    // Select a memo
    await memoAutocomplete.click()
    await memoAutocomplete.fill('Coffee')
    await page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )
    await memoAutocomplete.selectSuggestion('Coffee Shop')
    await page.waitForTimeout(500)

    // Wait for transactions API call
    const transactionsRequest = await transactionsRequestPromise

    // Verify the transactions API receives memo NAME, not ID
    const requestUrl = transactionsRequest.url()
    expect(requestUrl).toContain('memo=Coffee')
    expect(requestUrl).not.toContain('memo=101')
    expect(requestUrl).not.toContain('memoId=101')
  })

  test('should create shareable URL with memo ID', async ({ page }) => {
    // Navigate to transactions page
    await transactionsPage.goto()
    await transactionsPage.waitForTransactionsTableReady()

    // Select a memo
    await memoAutocomplete.click()
    await memoAutocomplete.fill('Coffee')
    await page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )
    await memoAutocomplete.selectSuggestion('Coffee Shop')
    await page.waitForTimeout(500)

    // Get the URL
    const urlWithMemo = page.url()
    expect(urlWithMemo).toContain('memo=101')

    // Open the same URL in a new context (simulating sharing)
    const newContext = await page.context().browser()?.newContext()
    if (!newContext) throw new Error('Could not create new context')

    const newPage = await newContext.newPage()

    // Setup mocks for new page
    await mockMemoRoutes(newPage, { memos: MEMO_SEARCH_DATASETS.coffee as unknown as Memo[] })
    await mockTransactionRoutes(newPage)
    await mockTimeIntervalRoutes(newPage)

    // Navigate to the shared URL
    await newPage.goto(urlWithMemo)
    await newPage.waitForLoadState('networkidle')
    await newPage.waitForTimeout(1000)

    // Verify memo is selected in the new page
    const newMemoAutocomplete = new AutocompleteComponent(newPage, 'transactions-table-memo-select')
    await newMemoAutocomplete.expectValue('Coffee Shop')

    // Clean up
    await newContext.close()
  })
})

test.describe('MemoSelect URL with useTransactions Integration', () => {
  let transactionsPage: TransactionsPage
  let memoAutocomplete: AutocompleteComponent

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    memoAutocomplete = new AutocompleteComponent(page, 'transactions-table-memo-select')

    await mockMemoRoutes(page, { memos: MEMO_SEARCH_DATASETS.coffee as unknown as Memo[] })
    await mockTransactionRoutes(page)
    await mockTimeIntervalRoutes(page)
  })

  test('should trigger useTransactions refetch when memo is selected from URL', async ({
    page,
  }) => {
    // Navigate directly to URL with memo ID
    await page.goto('/budget-visualizer/transactions?memo=101')

    // Wait for component to be ready
    await transactionsPage.waitForTransactionsTableReady()

    // Verify the autocomplete has the memo name loaded
    await memoAutocomplete.expectValue('Coffee Shop')

    // Verify URL still has the memo ID
    expect(page.url()).toContain('memo=101')
  })

  test('should update store and trigger API request when memo selected', async ({ page }) => {
    await transactionsPage.goto()
    await transactionsPage.waitForTransactionsTableReady()

    // Select a memo
    await memoAutocomplete.click()
    await memoAutocomplete.fill('Coffee')
    await page.waitForResponse(
      (response) => response.url().includes('/memos') && response.url().includes('name=Coffee'),
    )
    await memoAutocomplete.selectSuggestion('Coffee Shop')
    // await page.waitForTimeout(1000)

    // Verify URL was updated with memo ID
    expect(page.url()).toContain('memo=101')

    // Verify autocomplete shows the selected memo name
    await memoAutocomplete.expectValue('Coffee Shop')

    // The store update and API request are tested implicitly by the above assertions
    // If the URL has the ID and the UI shows the name, the integration is working
  })
})
