import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { setupTransactionsTableWithComprehensiveMocks } from '@test/e2e/helpers/setupTestMocks.ts'
import { staticTransactions } from '@test/e2e/mocks/transactionsMock.ts'

test.beforeEach(async ({ page }) => {
  await page.goto('/budget-visualizer')
})

test('the NavBar is visible', async ({ page }) => {
  const navBar = page.locator('.el-tabs').first()
  await expect(navBar).toBeVisible()
})

test.describe('NavBar loads the Budget Visualizer tab', () => {
  test('the Budget Visualizer tab is visible', async ({ page }) => {
    const navBar = page.locator('.el-tabs')
    const budgetVisualizerTab = navBar.getByRole('tab', { name: 'budget-visualizer' })
    await expect(budgetVisualizerTab).toBeVisible()
  })

  test('the Budget Visualizer tab is clickable and its components are visible after clicking', async ({
    page,
  }) => {
    const navBar = page.locator('.el-tabs')
    const budgetVisualizerTab = navBar.getByRole('tab', { name: 'budget-visualizer' })
    await budgetVisualizerTab.click()

    await expect(page.getByRole('heading', { name: 'Budget Visualizer' })).toBeVisible()
    await expect(page.getByRole('menubar')).toBeVisible()
    await expect(
      page.locator('div').filter({ hasText: 'Budget Visualizer Add New' }).nth(3),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add New Transaction' })).toBeVisible()
    await expect(page.getByRole('link').first()).toBeVisible()
    await expect(page.getByRole('link').nth(1)).toBeVisible()
    await expect(page.getByRole('link').nth(2)).toBeVisible()
  })

  test('clicking the Transactions icon on the menu NavBar opens the TransactionsTable', async ({
    transactionsPage,
  }) => {
    await setupTransactionsTableWithComprehensiveMocks(
      transactionsPage.page,
      staticTransactions.reverse(),
      staticDailyIntervals,
    )

    // find the transaction icon
    const transactionsIcon = transactionsPage.page
      .getByRole('menubar')
      .getByRole('menuitem')
      .first()
    // expect its visibility
    await expect(transactionsIcon).toBeVisible()

    // mock the transactions API response
    await setupTransactionsTableWithComprehensiveMocks(
      transactionsPage.page,
      staticTransactions.reverse(),
      staticDailyIntervals,
    )

    // click the menuitem icon
    await transactionsIcon.click()
    // wait for the DOM to load the transactions table
    await transactionsPage.page.waitForLoadState('domcontentloaded')
    // wait for the transactions table to be visible
    await transactionsPage.transactionsTable.waitFor({ state: 'visible' })
    // assert its visibility
    await expect(transactionsPage.transactionsTable).toBeVisible()
    // check that we're on the /transactions  page
    await expect(transactionsPage.page).toHaveURL(/\/transactions$/)
  })
})
