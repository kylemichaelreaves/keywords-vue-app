import type { Locator, Page } from '@playwright/test'

export class LoanCalculatorPage {
  readonly navBar: Locator
  readonly loanCalculatorTab: Locator
  readonly loanCalculatorPageHeading: Locator

  constructor(public readonly page: Page) {
    this.navBar = this.page.locator('.el-tabs__nav-scroll')
    this.loanCalculatorTab = this.navBar
      .getByRole('tab', {
        name: 'loan-calculator',
      })
      .locator('span')
      .first()
    this.loanCalculatorPageHeading = this.page.getByRole('heading', { name: 'Loan Calculator' })
  }

  async goto() {
    await this.page.goto('/budget-visualizer/loan-calculator')
  }
}
