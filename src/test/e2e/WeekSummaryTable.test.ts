import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { WeekSummaryPage } from '@test/e2e/pages/WeekSummaryPage'
import { mockTransactionsTableSelects } from '@test/e2e/helpers/mockTransactionsTableSelects.ts'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { generateMonthSummaryArray } from '@test/e2e/mocks/monthSummaryMock.ts'

test.describe('Week Summary Table', () => {
  let transactionsPage: TransactionsPage
  let weekSummaryPage: WeekSummaryPage
  let selectedWeek: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    weekSummaryPage = new WeekSummaryPage(page)


    // mock transactions?limit=100&offset=0&timeFrame=year
    await page.route('**/transactions?limit=100&offset=0&timeFrame=year', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTransactionsArray(100))
      })
    })

    // mock /transactions?limit=100&offset=0&timeFrame=week&date=2025-06-30T00:00:00.000Z
    await page.route('**/transactions?limit=*&offset=0&timeFrame=week&date=*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTransactionsArray(25))
      })
    })



    // Mock the transactions for the week summary
    // await page.route('**/transactions?limit=*&offset=0&timeFrame=week&date=*', route => {
    //   route.fulfill({
    //     status: 200,
    //     contentType: 'application/json',
    //     body: JSON.stringify(generateMonthSummaryArray(20))
    //   })
    // })

    // Mock the week summary data
    await page.route('**/transactions/weeks/**/summary', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateMonthSummaryArray(20))
      })
    })

    // mock individual memo API calls for the context menu functionality
    await page.route('**/memos/*', async route => {
      const url = new URL(route.request().url())
      const memoName = url.pathname.split('/').pop()

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 1,
          name: memoName,
          budget_category: 'Groceries',
          total_amount_debit: -150.00,
          necessary: true,
          recurring: false,
          frequency: null,
          ambiguous: false
        }])
      })
    })

    // mock the transactions count
    await page.route('**/transactions?count=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 200 })
      })
    })

    // mock the total_amount_debit for the week
    await page.route(url => {
      const urlObj = new URL(url)
      return urlObj.pathname.endsWith('/transactions') &&
        urlObj.searchParams.get('timeFrame') === 'week' &&
        urlObj.searchParams.get('totalAmountDebit') === 'true' &&
        urlObj.searchParams.has('date')
    }, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          [{ total_amount_debit: -700 }]
        )
      })
    })

    // mock transactions/weeks/27-2025/days
    await page.route('**/transactions/weeks/**/days', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]) // Empty array for simplicity
      })
    })




    await mockTransactionsTableSelects(page)


    await transactionsPage.goto()

    // click on week select
    await transactionsPage.weekSelect.click()
    // wait for the week select options to be visible
    await transactionsPage.page.getByRole('option').first().waitFor({ state: 'visible' })

    // get the text content of the first option
    const firstWeekText = await transactionsPage.page.getByRole('option').first().textContent() ?? ''
    const firstOption = transactionsPage.page.getByRole('option', { name: firstWeekText }).first()

    selectedWeek = await firstOption.textContent() ?? null

    // selectedWeek = firstOption

    await firstOption.click()

    await weekSummaryPage.page.waitForLoadState('networkidle')
  })

  test('should display the week summary table', async () => {
    await weekSummaryPage.expectTableVisible();
  })

  test('should show selected week in the title header', async () => {
    const weekTitle = await weekSummaryPage.getWeekTitle()
    // get the selectedWeek from the week select

    expect(weekTitle).toContain(selectedWeek)



    // expect(stats.transactionsCount).toBe('10')
    // expect(stats.transactionsAmount).toBe('-5000')
  })

  test('should reset the week when reset button is clicked', async () => {
    await weekSummaryPage.clickResetButton()
    // waitFor
    await transactionsPage.page.waitForLoadState('networkidle')

    const weekSelectValue = await transactionsPage.getWeekSelectValue()
    expect(weekSelectValue).toBe('')
  })

  test('the next week button should be disabled, since we are on the first week in the weeks', async () => {
    await weekSummaryPage.page.getByRole('button', { name: 'Next Week' }).isDisabled()
  })

  test.describe('Memo Edit Context Menu', () => {
    test('right clicking on a table row opens the memo edit modal', async ({ page }) => {
      await transactionsPage.goto()
      await mockTransactionsTableSelects(page)
      selectedWeek = await transactionsPage.selectFirstWeek()
      await page.waitForLoadState('networkidle')

      // Initially modal should be hidden
      await weekSummaryPage.expectMemoEditModalHidden()

      // Right click on the first row
      await weekSummaryPage.rightClickOnTableRow(0)
      await page.waitForLoadState('networkidle')


      // Modal should now be visible
      await weekSummaryPage.expectMemoEditModalVisible()
    })

    test('memo edit modal displays the correct title for the selected memo', async ({ page }) => {
      await transactionsPage.goTo()
      await mockTransactionsTableSelects(page)
      selectedWeek = await transactionsPage.selectFirstWeek()
      await page.waitForLoadState('networkidle')

      // Right click on the first row
      await weekSummaryPage.rightClickOnTableRow(0)
      await page.waitForLoadState('networkidle')

      // Check that the modal title contains "Edit Memo:"
      await weekSummaryPage.expectMemoEditFormTitle('Edit Memo:')
    })

    test('memo edit form is visible when modal opens', async ({ page }) => {
      await transactionsPage.goTo()
      await mockTransactionsTableSelects(page)
      selectedWeek = await transactionsPage.selectFirstWeek()
      await page.waitForLoadState('networkidle')

      // Right click on the first row
      await weekSummaryPage.rightClickOnTableRow(0)

      // Form should be visible
      await weekSummaryPage.expectMemoEditFormVisible()
    })

    test('closing the memo edit modal hides it', async ({ page }) => {
      await transactionsPage.goTo()
      await mockTransactionsTableSelects(page)
      selectedWeek = await transactionsPage.selectFirstWeek()
      await page.waitForLoadState('networkidle')

      // Right click to open modal
      await weekSummaryPage.rightClickOnTableRow(0)
      await page.waitForLoadState('networkidle')
      await weekSummaryPage.expectMemoEditModalVisible()

      // Close the modal
      await weekSummaryPage.closeMemoEditModal()

      // Modal should be hidden
      await weekSummaryPage.expectMemoEditModalHidden()
    })
  })
})