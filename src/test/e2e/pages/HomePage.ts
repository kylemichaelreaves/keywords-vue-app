import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly navbar: Locator
  readonly themeToggle: Locator
  readonly htmlElement: Locator
  readonly heading: Locator
  readonly body: Locator

  constructor(page: Page) {
    this.page = page
    this.navbar = page.getByTestId('navbar')
    this.themeToggle = this.navbar.getByTestId('theme-toggle')
    this.htmlElement = page.locator('html')
    this.heading = page.getByRole('heading')
    this.body = page.locator('body')
  }

  async goto() {
    await this.page.goto('/')
    await this.navbar.waitFor()
  }

  async navigateToTab(tabName: string) {
    await this.page.getByRole('tab', { name: tabName }).click()
  }

  async navigateToHome() {
    await this.page.getByRole('link').first().click()
    await this.page.getByText('home', { exact: true }).click()
  }

  async reload() {
    await this.page.reload()
    await this.navbar.waitFor()
  }

  // Theme functionality
  async getThemeFromLocalStorage(): Promise<string | null> {
    return await this.page.evaluate(() => localStorage.getItem('theme'))
  }

  async getHtmlClass(): Promise<string | null> {
    return await this.htmlElement.getAttribute('class')
  }

  async toggleTheme() {
    // expect the theme toggle to be visible
    await expect(this.themeToggle).toBeVisible()
    // interact with the theme toggle
    await this.themeToggle.click()
  }

  async waitForThemeChange(expectedTheme: string) {
    await expect(async () => {
      const currentTheme = await this.getThemeFromLocalStorage()
      expect(currentTheme).toBe(expectedTheme)
    }).toPass()
  }

  async waitForThemeToNotBe(notExpectedTheme: string | null) {
    await expect(async () => {
      const currentTheme = await this.getThemeFromLocalStorage()
      expect(currentTheme).not.toBe(notExpectedTheme)
    }).toPass()
  }

  async expectThemeToggleVisible() {
    await expect(this.themeToggle).toBeVisible()
  }

  async expectDarkTheme() {
    await expect(this.htmlElement).toHaveClass(/dark/)
    await expect(this.htmlElement).not.toHaveClass(/light/)
  }

  async expectLightTheme() {
    await expect(this.htmlElement).toHaveClass(/light/)
    await expect(this.htmlElement).not.toHaveClass(/dark/)
  }

  async expectThemeClass(theme: string) {
    if (theme === 'dark') {
      await this.expectDarkTheme()
    } else {
      await this.expectLightTheme()
    }
  }

  // Home page content assertions
  async expectHomePageContent() {
    await expect(this.heading).toContainText('Home')
    await expect(this.body).toContainText('In this demonstration of immense innovation and skill…')
    await expect(this.body).toContainText(
      'I will be sketching out extremely sophisticated and mesmerizing UIs for my Lambdas and what they return.',
    )
    await expect(this.body).toContainText(
      'BudgetVisualizer will only work for me, since it is pulling records from a database behind a VPC',
    )
    await expect(this.body).toContainText(
      "AddressGeocoder won't work either; I doubt I set it up to take public requests",
    )
    await expect(this.body).toContainText('Keywords I never started…I moved onto other things')
  }
}
