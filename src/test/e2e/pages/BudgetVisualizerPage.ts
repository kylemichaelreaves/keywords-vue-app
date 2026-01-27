import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export class BudgetVisualizerPage {
  readonly page: Page
  readonly heading: Locator
  readonly addNewTransactionButton: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Budget Visualizer' })
    this.addNewTransactionButton = page.getByRole('button', { name: 'Add New Transaction' })
  }

  async expectPageLoaded() {
    await expect(this.addNewTransactionButton).toBeVisible()
  }
}
