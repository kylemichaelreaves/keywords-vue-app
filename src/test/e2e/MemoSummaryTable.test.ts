import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MemoSummaryTablePage } from '@test/e2e/pages/MemoSummaryTablePage'
import { MemosTablePage } from '@test/e2e/pages/MemosTablePage'
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import type { Memo } from '@types'
import { mockMemoRoutes, mockTransactionRoutes } from '@test/e2e/helpers/setupTestMocks.ts'

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
      budget_category: null,
    } as Memo

    // Use consolidated mock with custom memos
    await mockMemoRoutes(page, { memos: [memoWithoutBudgetCategory, ...memos.slice(1)] })
    await mockTransactionRoutes(page) // This handles /transactions?memoId=*

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

  test('when the memo lacks a budget_category, the budget_category button should be visible and clickable', async ({
    page,
  }) => {
    // Unroute ALL routes and set up fresh mocks
    await page.unrouteAll()

    const memos = generateMemosArray()

    // Create memo without budget category
    const memoWithoutBudgetCategory = {
      ...memos[0],
      id: 20, // Match the ID from the URL
      budget_category: null,
    } as Memo

    // Re-register all routes with the modified memo
    await mockMemoRoutes(page, { memos: [memoWithoutBudgetCategory, ...memos.slice(1)] })
    await mockTransactionRoutes(page)

    // Navigate fresh
    const currentUrl = page.url()
    await page.goto(currentUrl)

    await page.waitForLoadState('networkidle')

    // Now the button should be visible
    await expect(memoSummaryTablePage.budgetCategoryButton).toBeVisible({ timeout: 15000 })
    await memoSummaryTablePage.budgetCategoryButton.click()
    await expect(memoSummaryTablePage.budgetCategoryModal).toBeVisible({ timeout: 5000 })
  })
})
