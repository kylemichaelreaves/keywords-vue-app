import { HomePage } from '@test/e2e/pages/HomePage'
import { test as base } from '@playwright/test'
import { BudgetVisualizerPage } from '@test/e2e/pages/BudgetVisualizerPage'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'

type PageFixture = {
  homePage: HomePage
  budgetVisualizerPage: BudgetVisualizerPage
  transactionsPage: TransactionsPage
}

export const test = base.extend<PageFixture>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  budgetVisualizerPage: async ({ page }, use) => {
    await use(new BudgetVisualizerPage(page))
  },
  transactionsPage: async ({ page }, use) => {
    await use(new TransactionsPage(page))
  },
})

export { expect } from '@playwright/test'
