import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MemoSummaryTablePage } from '@test/e2e/pages/MemoSummaryTablePage'
import { MemosTablePage } from '@test/e2e/pages/MemosTablePage'
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'


test.describe('Memo Summary Table', () => {
  let memoSummaryTablePage: MemoSummaryTablePage
  let memosPage: MemosTablePage
  let firstMemoName: string

  test.beforeEach(async ({ page }) => {
    memosPage = new MemosTablePage(page)
    memoSummaryTablePage = new MemoSummaryTablePage(page)

    const memos = generateMemosArray()

    // mock memos?limit=100&offset=0
    await page.route('**/memos?limit=100&offset=0', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(memos)
      })
    })

    // mock a single
    await page.route('**/memos/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(memos[0])
      })
    })

    // mock /dev/memos/**/summary
    await page.route('**/memos/**/summary', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            'sum_amount_debit': 0,
            'transactions_count': 1
          }
        ])
      })
    })

    // mock the memos count
    await page.route('**/memos?count=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: memos.length * 4 }) // multiply, so that the pagination works
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
    await memoSummaryTablePage.memoSummaryTable.waitFor({ state: 'visible' })
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