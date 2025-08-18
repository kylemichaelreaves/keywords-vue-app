import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MemoSummaryTablePage } from '@test/e2e/pages/MemoSummaryTablePage'
import { MemosTablePage } from '@test/e2e/pages/MemosTablePage'
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { mockMemoTableRoutes } from '@test/e2e/helpers/mockMemoRoutes.ts'
import type { Memo } from '@types'


test.describe('Memo Summary Table', () => {
  let memoSummaryTablePage: MemoSummaryTablePage
  let memosPage: MemosTablePage
  let firstMemoName: string
  let memoWithoutBudgetCategory: Memo

  test.beforeEach(async ({ page }) => {
    memosPage = new MemosTablePage(page)
    memoSummaryTablePage = new MemoSummaryTablePage(page)

    const memos = generateMemosArray()
    memoWithoutBudgetCategory = {
      ...memos[0],
      budget_category: null
    } as Memo

    // Use the shared mock helper for most routes
    await mockMemoTableRoutes(page)

    // Override the single memo route to return memo WITH budget_category null from the start
    await page.route('**/memos/**', route => {
      const url = new URL(route.request().url())
      const pathSegments = url.pathname.split('/')
      const lastSegment = pathSegments[pathSegments.length - 1]

      // Skip if this is a summary route (should be handled by mockMemoTableRoutes)
      if (lastSegment === 'summary') {
        return route.continue()
      }

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([memoWithoutBudgetCategory]) // Return array containing the memo object
      })
    })

    // mock /dev/memos/**/summary
    await page.route('**/memos/**/summary', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            'total_amount_debit': 3000,
            'transactions_count': 15
          }
        ])
      })
    })

    // mock /transactions?memo=*
    await page.route('**/transactions?memo=*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTransactionsArray(5, memos[0].name))
      })
    })


    await memosPage.goTo()


    firstMemoName = await memosPage.getFirstMemoName()

    await memosPage.clickFirstMemoLink()

    await memoSummaryTablePage.page.waitForLoadState('networkidle')
    await memoSummaryTablePage.memoSummaryCard.waitFor({ state: 'visible' })
  })

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })


  test('should display the memo title', async () => {
    const title = await memoSummaryTablePage.getMemoTitle()
    expect(title).toBe(firstMemoName)
  })

  test('should display the memo card table', async () => {
    await memoSummaryTablePage.expectMemoSummaryCardVisible()
  })

  test('should handle back button click', async () => {
    await memoSummaryTablePage.clickBackButton()
    await expect(memoSummaryTablePage.page).toHaveURL(/\/budget-visualizer\/memos/)
  })

  test('when the memo lacks a budget_category, the budget category button should be visible and clickable', async ({ page }) => {
    console.log('TEST: Starting combined budget category button test')

    // Clear the existing memo route specifically
    await page.unroute('**/memos/**')

    // Get the current memo name for consistency
    const currentMemoText = await memoSummaryTablePage.getMemoTitle()
    console.log('TEST: Current memo loaded:', currentMemoText)

    // Create a memo without budget category using the CURRENT memo name
    const memoWithoutBudgetCategory = {
      id: 1,
      name: currentMemoText || 'Test Memo',
      recurring: false,
      necessary: false,
      frequency: null,
      budget_category: null, // This is the key - no budget category
      ambiguous: false,
      avatar_s3_url: null
    }
    console.log('TEST: Created memo without budget category:', memoWithoutBudgetCategory)

    // Set up a more specific route interceptor that doesn't interfere with summary endpoint
    await page.route('**/memos/**', async route => {
      const url = new URL(route.request().url())
      const pathSegments = url.pathname.split('/')
      const lastSegment = pathSegments[pathSegments.length - 1]

      // Only intercept if this is NOT a summary route
      if (lastSegment !== 'summary') {
        console.log('TEST: Route intercepted for memo details:', route.request().url())
        // Return array containing the memo object - this matches the expected API format
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([memoWithoutBudgetCategory]) // Array containing the memo object
        })
      } else {
        // Let summary routes pass through to the original mock
        console.log('TEST: Allowing summary route to pass through:', route.request().url())
        await route.continue()
      }
    })

    // Navigate to the same page fresh (instead of reload)
    const currentUrl = page.url()
    console.log('TEST: Navigating to trigger new data:', currentUrl)
    await page.goto(currentUrl)

    // Wait for the page to be ready
    await page.waitForLoadState('networkidle')

    // Add debugging for page state
    const pageState = await page.evaluate(() => {
      const budgetCategoryColumn = document.querySelector('[data-testid="budget-category-column"]')
      const budgetCategoryButton = document.querySelector('[data-testid="budget-category-button"]')

      return {
        budgetColumnExists: !!budgetCategoryColumn,
        budgetColumnLoading: budgetCategoryColumn?.getAttribute('data-loading'),
        budgetColumnHasCategory: budgetCategoryColumn?.getAttribute('data-has-category'),
        budgetButtonExists: !!budgetCategoryButton,
        allTestIds: Array.from(document.querySelectorAll('[data-testid]')).map(el => el.getAttribute('data-testid')),
        pageTitle: document.title,
        currentUrl: window.location.href
      }
    })
    console.log('TEST: Page state after navigation:', JSON.stringify(pageState, null, 2))

    // Wait for the button to be visible - this is the main test
    console.log('TEST: Waiting for budget category button to be visible')
    await expect(memoSummaryTablePage.budgetCategoryButton).toBeVisible({ timeout: 15000 })
    console.log('TEST: Budget category button is visible!')

    // Now test clicking the button to open the modal
    console.log('TEST: Clicking budget category button to test modal opening')
    await memoSummaryTablePage.budgetCategoryButton.click()

    // Check if modal opens
    console.log('TEST: Waiting for modal to be visible')
    await expect(memoSummaryTablePage.budgetCategoryModal).toBeVisible({ timeout: 5000 })
    console.log('TEST: Modal is visible! Test passed.')
  })
})