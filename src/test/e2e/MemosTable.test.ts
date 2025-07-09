import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MemosTablePage } from '@test/e2e/pages/MemosTablePage.ts'

test.describe('Memos Table', () => {
  let memosPage: MemosTablePage

  test.beforeEach(async ({ page }) => {
    memosPage = new MemosTablePage(page)
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