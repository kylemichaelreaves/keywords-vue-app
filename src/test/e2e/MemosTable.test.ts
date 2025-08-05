import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MemosTablePage } from '@test/e2e/pages/MemosTablePage.ts'
import { setupMemosTableMocks } from '@test/e2e/helpers/setupTestMocks'

test.describe('Memos Table', () => {
  let memosPage: MemosTablePage

  test.beforeEach(async ({ page }) => {
    memosPage = new MemosTablePage(page)

    console.time('setting up memosTableMocks')
    await setupMemosTableMocks(page)
    console.timeEnd('setting up memosTableMocks')

    await memosPage.goTo()
    await memosPage.memosTable.waitFor({ state: 'visible' })
    await page.waitForLoadState('networkidle')
  })

  test('should display the memos table', async () => {
    await expect(memosPage.memosTable).toBeVisible()
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

  test('right clicking within a cell should open the edit modal', async () => {
    // right-clicking on the first cell opens the edit modal
    await memosPage.rightClickOnFirstMemo()
    // the modal is visible
    await memosPage.expectMemoEditModalToBeVisible()
    // everything we expect to be in the form is in fact actually there
    await memosPage.expectMemoEditFormElementsToBeVisible()
  })
})