import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { setupTransactionsTableWithComprehensiveMocks } from '@test/e2e/helpers/setupTestMocks.ts'
import { staticTransactions } from '@test/e2e/mocks/transactionsMock.ts'

test.beforeEach(async ({ page }) => {
  await page.goto('/budget-visualizer')
})

test('the NavBar is visible', async ({ page }) => {
  const navBar = page.getByLabel('Navigation Bar')
  await expect(navBar).toBeVisible()
})

test.describe('NavBar loads the Budget Visualizer tab', () => {
  test('the Budget Visualizer tab is visible', async ({ page }) => {
    const navBar = page.getByTestId('navbar')
    const budgetVisualizerTab = navBar.getByRole('tab', { name: 'budget-visualizer' })
    await expect(budgetVisualizerTab).toBeVisible()
  })

  test('the Budget Visualizer tab is clickable and its components are visible after clicking', async ({
    page,
  }) => {
    const navBar = page.getByTestId('navbar')
    const budgetVisualizerTab = navBar.getByRole('tab', { name: 'budget-visualizer' })
    await budgetVisualizerTab.click()

    const sidebar = page.getByLabel('Budget sections')
    await expect(sidebar).toBeVisible()

    await expect(page.getByRole('button', { name: 'Add New Transaction' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Transactions' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Memos' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Budgets' })).toBeVisible()
  })

  test('clicking the Transactions link in the sidebar opens the TransactionsTable', async ({
    transactionsPage,
  }) => {
    await setupTransactionsTableWithComprehensiveMocks(
      transactionsPage.page,
      [...staticTransactions].reverse(),
      staticDailyIntervals,
    )

    const sidebar = transactionsPage.page.getByLabel('Budget sections')
    const transactionsLink = sidebar.getByRole('link', { name: 'Transactions' })
    await expect(transactionsLink).toBeVisible()

    await setupTransactionsTableWithComprehensiveMocks(
      transactionsPage.page,
      [...staticTransactions].reverse(),
      staticDailyIntervals,
    )

    await transactionsLink.click()
    await transactionsPage.page.waitForLoadState('domcontentloaded')
    await transactionsPage.transactionsTable.waitFor({ state: 'visible' })
    await expect(transactionsPage.transactionsTable).toBeVisible()
    await expect(transactionsPage.page).toHaveURL(/\/transactions$/)
  })
})
