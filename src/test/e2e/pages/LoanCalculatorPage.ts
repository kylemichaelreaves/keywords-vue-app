import type { Locator, Page } from '@playwright/test'

export class LoanCalculatorPage {
  readonly loanCalculatorPageHeading: Locator

  constructor(public readonly page: Page) {
    this.loanCalculatorPageHeading = this.page.getByRole('heading', { name: 'Loan Calculator' })
  }

  async goto() {
    await this.page.goto('/budget-visualizer/debt')
  }
}
