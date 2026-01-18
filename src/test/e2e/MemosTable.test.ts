import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MemosTablePage } from '@test/e2e/pages/MemosTablePage.ts'
import { setupMemosTableMocks } from '@test/e2e/helpers/setupTestMocks'

test.describe('Memos Table', () => {
  let memosPage: MemosTablePage

  test.beforeEach(async ({ page }) => {
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text())
      }
    })

    // Listen for page errors (uncaught exceptions)
    page.on('pageerror', (error) => {
      console.log('Page error:', error.message)
    })

    // Log all network requests and responses
    page.on('request', (request) => {
      console.log('➡️ Request:', request.method(), request.url())
    })

    page.on('response', (response) => {
      console.log('⬅️ Response:', response.status(), response.url())
    })

    // Log failed requests
    page.on('requestfailed', (request) => {
      console.log('❌ Request failed:', request.url(), request.failure()?.errorText)
    })

    memosPage = new MemosTablePage(page)
    await setupMemosTableMocks(page)
    await memosPage.goTo()

    // Take a screenshot before waiting for table
    await page.screenshot({ path: 'debug-before-wait.png' })

    // Also log the page content
    const content = await page.content()
    console.log('Page HTML length:', content.length)
    console.log('Page HTML preview:', content.substring(0, 500))

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
