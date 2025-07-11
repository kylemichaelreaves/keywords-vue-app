import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MemosTablePage } from '@test/e2e/pages/MemosTablePage.ts'
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'

test.describe('Memos Table', () => {
  let memosPage: MemosTablePage

  test.beforeEach(async ({ page }) => {
    memosPage = new MemosTablePage(page)

    const memos = generateMemosArray()

    // mock the memos count
    await page.route('**/memos?count=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: memos.length * 4 }) // multiply, so that the pagination works
      })
    })

    // mock memos?limit=100&offset=0
    await page.route('**/memos?limit=100&offset=0', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(memos)
      })
    })


    await memosPage.goTo()
    await page.waitForLoadState('networkidle')
  })

  test('should display the memos table', async () => {
    await memosPage.memosTable.waitFor({ state: 'visible' })
    await memosPage.page.waitForLoadState('networkidle')
    expect(memosPage.memosTable.isVisible()).toBeTruthy()
  })

  test('should display the correct page title', async () => {
    const title = await memosPage.getMemosPageTitle()
    expect(title).toBe('Memos Table')
  })

  test.skip('should handle error state', async () => {
    await memosPage.expectNoError()
    // Simulate an error condition if needed
    // await memosPage.expectError('An error occurred while loading memos')
  })

})