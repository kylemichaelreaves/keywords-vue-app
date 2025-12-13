// page-objects/alert-component.po.ts
import { type Page, expect } from '@playwright/test'

export type AlertType = 'success' | 'warning' | 'info' | 'error'

/**
 * Page Object for the Alert Component
 * Encapsulates all interactions with alert components
 */
export class AlertComponent {
  private page: Page
  private testId: string

  constructor(page: Page, testId: string = 'alert') {
    this.page = page
    this.testId = testId
  }

  // Locator methods
  get alert() {
    return this.page.getByTestId(this.testId)
  }

  get titleElement() {
    return this.page.getByTestId(`${this.testId}-title`)
  }

  get messageElement() {
    return this.page.getByTestId(`${this.testId}-message`)
  }

  get closeButton() {
    return this.alert.getByRole('button', { name: /close/i })
  }

  get icon() {
    return this.alert.getByRole('img')
  }

  // Action methods
  async close() {
    await this.closeButton.click()
  }

  async waitForAlert() {
    await this.alert.waitFor({ state: 'visible' })
  }

  async waitForAlertToDisappear() {
    await this.alert.waitFor({ state: 'hidden' })
  }

  // Query methods
  async isVisible() {
    return await this.alert.isVisible()
  }

  async isClosable() {
    try {
      return await this.closeButton.isVisible()
    } catch {
      return false
    }
  }

  async hasIcon() {
    try {
      return await this.icon.isVisible()
    } catch {
      return false
    }
  }

  async getTitle() {
    return (await this.titleElement.textContent()) || ''
  }

  async getMessage() {
    return (await this.messageElement.textContent()) || ''
  }

  async getType(): Promise<AlertType> {
    // Use accessible role and name patterns to determine type
    const alert = this.alert

    // Check for success indicators
    const successIcon = alert.getByRole('img').and(alert.getByText(/success/i))
    if (await successIcon.isVisible().catch(() => false)) return 'success'

    // Check for warning indicators
    const warningIcon = alert.getByRole('img').and(alert.getByText(/warning/i))
    if (await warningIcon.isVisible().catch(() => false)) return 'warning'

    // Check for error indicators
    const errorIcon = alert.getByRole('img').and(alert.getByText(/error/i))
    if (await errorIcon.isVisible().catch(() => false)) return 'error'

    // Default to info if no specific type detected
    return 'info'
  }

  // Assertion methods
  async expectToBeVisible() {
    await expect(this.alert).toBeVisible()
  }

  async expectToBeHidden() {
    await expect(this.alert).not.toBeVisible()
  }

  async expectToHaveTitle(title: string) {
    await expect(this.titleElement).toHaveText(title)
  }

  async expectToHaveMessage(message: string) {
    await expect(this.messageElement).toHaveText(message)
  }

  async expectToHaveType(type: AlertType) {
    const actualType = await this.getType()
    expect(actualType).toBe(type)
  }

  async expectToBeClosable() {
    expect(await this.isClosable()).toBe(true)
  }

  async expectToNotBeClosable() {
    expect(await this.isClosable()).toBe(false)
  }

  async expectToHaveIcon() {
    expect(await this.hasIcon()).toBe(true)
  }

  async expectToNotHaveIcon() {
    expect(await this.hasIcon()).toBe(false)
  }

  async expectToContainText(text: string) {
    await expect(this.alert).toContainText(text)
  }

  // Convenience methods for common scenarios
  async expectSuccessAlert(title: string, message: string) {
    await this.expectToBeVisible()
    await this.expectToHaveType('success')
    await this.expectToHaveTitle(title)
    await this.expectToHaveMessage(message)
  }

  async expectErrorAlert(title: string, message: string) {
    await this.expectToBeVisible()
    await this.expectToHaveType('error')
    await this.expectToHaveTitle(title)
    await this.expectToHaveMessage(message)
  }

  async expectWarningAlert(title: string, message: string) {
    await this.expectToBeVisible()
    await this.expectToHaveType('warning')
    await this.expectToHaveTitle(title)
    await this.expectToHaveMessage(message)
  }

  async expectInfoAlert(title: string, message: string) {
    await this.expectToBeVisible()
    await this.expectToHaveType('info')
    await this.expectToHaveTitle(title)
    await this.expectToHaveMessage(message)
  }

  // Static factory methods for common use cases
  static forSuccess(page: Page, testId: string = 'success-alert') {
    return new AlertComponent(page, testId)
  }

  static forError(page: Page, testId: string = 'error-alert') {
    return new AlertComponent(page, testId)
  }

  static forWarning(page: Page, testId: string = 'warning-alert') {
    return new AlertComponent(page, testId)
  }

  static forInfo(page: Page, testId: string = 'info-alert') {
    return new AlertComponent(page, testId)
  }
}
