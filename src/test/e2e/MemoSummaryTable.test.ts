import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MemoSummaryTablePage } from '@test/e2e/pages/MemoSummaryTablePage'
import { MemosTablePage } from '@test/e2e/pages/MemosTablePage'


test.describe('Memo Summary Table', () => {
  let memoSummaryTablePage: MemoSummaryTablePage
  let memosPage: MemosTablePage
  let firstMemoName: string

  test.beforeEach(async ({ page }) => {
    memosPage = new MemosTablePage(page)
    memoSummaryTablePage = new MemoSummaryTablePage(page)
    await memosPage.goTo()
    firstMemoName = await memosPage.getFirstMemoNameLink()
    await memosPage.clickMemoLink(firstMemoName)
    await page.waitForLoadState('networkidle')
  })

  test('should display the memo title', async () => {
    const title = await memoSummaryTablePage.getMemoTitle()
    expect(title).toBe(firstMemoName)
  })

  test('should display the memo summary table', async () => {
    await memoSummaryTablePage.memoSummaryTable.waitFor({ state: 'visible' })
    expect(await memoSummaryTablePage.expectSummaryTableVisible()).toBeTruthy()
  })

  test.skip('should display correct stats', async () => {
    const stats = await memoSummaryTablePage.getStats()
    expect(stats.transactionsCount).toBe('5')
    expect(stats.transactionsAmount).toBe('$100.00')
  })

  test('should handle back button click', async () => {
    await memoSummaryTablePage.clickBackButton()
    await expect(memoSummaryTablePage.page).toHaveURL(/\/budget-visualizer\/memos/)
  })
})