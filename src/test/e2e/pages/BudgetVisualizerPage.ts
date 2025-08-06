import type { Locator, Page } from '@playwright/test'

export class BudgetVisualizerPage {
  readonly navBar: Locator
  readonly budgetVisualizerTab: Locator
  readonly budgetVisualizerPageHeading: Locator
  readonly addNewTransactionButton: Locator
  readonly menuNavbar: Locator
  readonly transactionsMenuItem: Locator
  readonly memosMenuItem: Locator
  readonly budgetCategoriesMenuItem: Locator

  constructor(public readonly page: Page) {

    this.navBar = this.page.getByTestId('navbar')
    this.budgetVisualizerTab = this.navBar.getByRole('tab', {
      name: 'budget-visualizer'
    }).locator('span').first()
    this.budgetVisualizerPageHeading = this.page.getByRole('heading', { name: 'Budget Visualizer' })
    this.addNewTransactionButton = this.page.getByRole('button', { name: 'Add New Transaction' })

    this.menuNavbar = this.page.getByRole('menubar')

    this.transactionsMenuItem = this.menuNavbar.getByRole('menuitem', { name: 'Transactions' })
    this.memosMenuItem = this.menuNavbar.getByRole('menuitem', { name: 'Memos' })
    this.budgetCategoriesMenuItem = this.menuNavbar.getByRole('menuitem', { name: 'Budget Categories' })
  }

  async goto() {
    await this.page.goto('/budget-visualizer')
  }

  async navigateToTransactions() {
    await this.transactionsMenuItem.click()
  }

  async navigateToMemos() {
    await this.memosMenuItem.click()
  }

  async navigateToBudgetCategories() {
    await this.budgetCategoriesMenuItem.click()
  }
}