// page-objects/select-component.po.ts
import { expect, type Page } from '@playwright/test'

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Page Object for the Select Component
 * Encapsulates all interactions with select components
 */
export class SelectComponent {
  private page: Page
  private testId: string

  constructor(page: Page, testId: string = 'select') {
    this.page = page
    this.testId = testId
  }

  // Locator methods
  get select() {
    return this.page.getByTestId(this.testId)
  }

  getOption(value: string) {
    return this.page.getByTestId(`option-${value}`)
  }

  get clearButton() {
    return this.select.getByRole('button', { name: /clear/i })
  }

  get dropdownTrigger() {
    return this.select.getByRole('combobox')
  }

  get loadingIndicator() {
    return this.select.getByText(/loading/i)
  }

  // Action methods
  async openDropdown() {
    await this.select.click()
    // Wait a moment for dropdown animation
    await this.page.waitForSelector('[data-testid^="option-"]', { state: 'visible' })
  }

  async closeDropdown() {
    await this.page.keyboard.press('Escape')
    await this.page.waitForSelector('[data-testid^="option-"]', { state: 'hidden' })
  }

  async selectOption(value: string) {
    await this.openDropdown()
    await this.getOption(value).click()
  }

  async selectOptionByLabel(label: string) {
    await this.openDropdown()
    await this.page.getByRole('option', { name: label }).click()
  }

  async clearSelection() {
    await this.clearButton.click()
  }

  async typeToFilter(text: string) {
    await this.select.click()
    await this.dropdownTrigger.pressSequentially(text)
  }

  async waitForOptions() {
    // Wait for at least one option to be visible
    await this.page.waitForSelector('[data-testid^="option-"]', { state: 'visible' })
  }

  async waitForLoading() {
    await this.loadingIndicator.waitFor({ state: 'visible' })
  }

  async waitForLoadingToFinish() {
    await this.loadingIndicator.waitFor({ state: 'hidden' })
  }

  // Query methods
  async isDisabled() {
    const disabled = await this.select.getAttribute('aria-disabled')
    return disabled === 'true'
  }

  async isLoading() {
    return await this.loadingIndicator.isVisible().catch(() => false)
  }

  async isDropdownOpen() {
    // Check if any options are visible
    const options = this.page.locator('[data-testid^="option-"]')
    return await options.first().isVisible().catch(() => false)
  }

  async getSelectedValue() {
    const input = this.dropdownTrigger
    return await input.inputValue().catch(async () => {
      // Fallback to text content if not an input
      return await this.select.textContent() ?? ''
    })
  }

  async getSelectedLabel() {
    const selectedText = await this.select.textContent() ?? ''
    // Remove clear button text if present
    return selectedText.replace('×', '').trim()
  }

  async getPlaceholder() {
    return await this.dropdownTrigger.getAttribute('placeholder') ?? ''
  }

  async hasOption(value: string) {
    await this.openDropdown()
    try {
      return await this.getOption(value).isVisible()
    } catch {
      return false
    } finally {
      await this.closeDropdown()
    }
  }

  async hasOptionByLabel(label: string) {
    await this.openDropdown()
    try {
      const option = this.page.getByRole('option', { name: label })
      return await option.isVisible()
    } catch {
      return false
    } finally {
      await this.closeDropdown()
    }
  }

  async getVisibleOptions(): Promise<SelectOption[]> {
    await this.openDropdown()

    const optionElements = await this.page.locator('[data-testid^="option-"]').all()
    const options: SelectOption[] = []

    for (const element of optionElements) {
      if (await element.isVisible()) {
        const testId = await element.getAttribute('data-testid') ?? ''
        const value = testId.replace('option-', '')
        const label = await element.textContent() ?? ''
        options.push({ value, label })
      }
    }

    await this.closeDropdown()
    return options
  }

  async getOptionCount() {
    await this.openDropdown()
    const count = await this.page.locator('[data-testid^="option-"]').count()
    await this.closeDropdown()
    return count
  }

  async isClearable() {
    try {
      return await this.clearButton.isVisible()
    } catch {
      return false
    }
  }

  // Assertion methods
  async expectToBeEnabled() {
    expect(await this.isDisabled()).toBe(false)
  }

  async expectToBeDisabled() {
    expect(await this.isDisabled()).toBe(true)
  }

  async expectToBeLoading() {
    expect(await this.isLoading()).toBe(true)
  }

  async expectToNotBeLoading() {
    expect(await this.isLoading()).toBe(false)
  }

  async expectDropdownToBeOpen() {
    expect(await this.isDropdownOpen()).toBe(true)
  }

  async expectDropdownToBeClosed() {
    expect(await this.isDropdownOpen()).toBe(false)
  }

  async expectToHaveSelectedValue(value: string) {
    const selectedValue = await this.getSelectedValue()
    expect(selectedValue).toBe(value)
  }

  async expectToHaveSelectedLabel(label: string) {
    const selectedLabel = await this.getSelectedLabel()
    expect(selectedLabel).toContain(label)
  }

  async expectToHavePlaceholder(placeholder: string) {
    await expect(this.select).toContainText(placeholder)
  }

  async expectToHaveOption(value: string, label?: string) {
    expect(await this.hasOption(value)).toBe(true)

    if (label) {
      await this.openDropdown()
      await expect(this.getOption(value)).toContainText(label)
      await this.closeDropdown()
    }
  }

  async expectToNotHaveOption(value: string) {
    expect(await this.hasOption(value)).toBe(false)
  }

  async expectToHaveOptions(options: SelectOption[]) {
    for (const option of options) {
      await this.expectToHaveOption(option.value, option.label)
    }
  }

  async expectToHaveOptionCount(count: number) {
    const actualCount = await this.getOptionCount()
    expect(actualCount).toBe(count)
  }

  async expectToBeClearable() {
    expect(await this.isClearable()).toBe(true)
  }

  async expectToNotBeClearable() {
    expect(await this.isClearable()).toBe(false)
  }

  async expectToBeEmpty() {
    const selectedLabel = await this.getSelectedLabel()
    const placeholder = await this.getPlaceholder()
    expect(selectedLabel).toBe(placeholder)
  }


  async selectAndVerify(value: string, expectedLabel: string) {
    await this.selectOption(value)
    await this.expectToHaveSelectedLabel(expectedLabel)
  }

  async clearAndVerify() {
    const placeholder = await this.getPlaceholder()
    await this.clearSelection()
    await this.expectToHavePlaceholder(placeholder)
  }

  async filterAndSelect(filterText: string, value: string) {
    await this.typeToFilter(filterText)
    await this.selectOption(value)
  }

}