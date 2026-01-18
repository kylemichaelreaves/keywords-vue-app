// page-objects/autocomplete-component.po.ts
import { expect, type Locator, type Page } from '@playwright/test'

export class AutocompleteComponent {
  private readonly page: Page
  private readonly testId: string

  constructor(page: Page, testId: string = 'autocomplete') {
    this.page = page
    this.testId = testId
  }

  // Locator methods
  get autocomplete(): Locator {
    // The data-testid is on the wrapper div around el-autocomplete
    return this.page.getByTestId(this.testId)
  }

  get input(): Locator {
    // Element Plus el-autocomplete: The textbox uses placeholder as accessible name
    // Use the placeholder text "Select a memo" to locate it within the autocomplete wrapper
    return this.autocomplete.getByRole('textbox', { name: 'Select a memo' })
  }

  get clearButton(): Locator {
    // The clear button is an img (close icon) that appears on hover inside the autocomplete
    return this.autocomplete.getByRole('img')
  }

  get dropdown(): Locator {
    // Target the listbox inside the autocomplete component's combobox
    // Element Plus renders the dropdown inside the combobox when expanded
    return this.autocomplete.getByRole('combobox').getByRole('listbox')
  }

  get loadingIndicator(): Locator {
    // Loading indicator is inside the dropdown popper - use aria role
    return this.page.getByRole('listbox').locator('[class*="is-loading"]')
  }

  getSuggestion(text: string): Locator {
    // Use partial match with regex to find options containing the text
    // This handles cases like searching for "Coffee" matching "Coffee Shop"
    return this.page.getByRole('option', { name: new RegExp(text, 'i') })
  }

  // Action methods
  async click(): Promise<void> {
    await this.input.click()
  }

  async fill(text: string): Promise<void> {
    await this.input.fill(text)
  }

  async type(text: string, options?: { delay?: number }): Promise<void> {
    await this.input.type(text, options)
  }

  async clear(): Promise<void> {
    await this.input.clear()
  }

  async clickClearButton(): Promise<void> {
    // Hover to reveal the clear button
    await this.input.hover()

    // Wait for clear button to be available
    await this.clearButton.waitFor({ state: 'attached', timeout: 5000 })
    await this.clearButton.waitFor({ state: 'visible', timeout: 5000 })

    // Click the clear button
    await this.clearButton.click()

    // Wait for the input to be cleared (value check)
    await this.expectToBeEmpty()

    // Wait for the input to be stable after Element Plus re-renders
    await this.input.waitFor({ state: 'attached', timeout: 3000 })
    await this.input.waitFor({ state: 'visible', timeout: 3000 })
  }

  async selectSuggestion(text: string): Promise<void> {
    // Use exact match for selection to click the specific option
    await this.page.getByRole('option', { name: text, exact: true }).click()
  }

  // Wait methods
  async waitForSuggestions(options?: { timeout?: number }): Promise<void> {
    // Wait for at least one option to be visible in the dropdown
    // This is more reliable than waiting for the listbox container since Element Plus
    // may have multiple listbox elements in the DOM
    await this.page
      .getByRole('option')
      .first()
      .waitFor({ state: 'visible', timeout: options?.timeout || 5000 })
  }

  async waitForLoading(options?: { timeout?: number }): Promise<void> {
    await this.loadingIndicator.waitFor({ state: 'visible', timeout: options?.timeout || 5000 })
  }

  async waitForLoadingToFinish(options?: { timeout?: number }): Promise<void> {
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: options?.timeout || 5000 })
  }

  async waitForSuggestionsToAppear(options?: { timeout?: number }): Promise<void> {
    // Simple wait for dropdown to appear, doesn't wait for loading or debounce
    // Use this when you just need the dropdown visible without waiting for data updates
    await this.dropdown.waitFor({ state: 'visible', timeout: options?.timeout || 5000 })
  }

  async waitForSuggestionsToUpdate(options?: { timeout?: number }): Promise<void> {
    // Wait for the debounce period (300ms from AutocompleteComponent)
    await this.page.waitForLoadState('networkidle')
    // Wait for dropdown to be visible, but allow it to stay open during loading
    await this.dropdown.waitFor({ state: 'visible', timeout: options?.timeout || 5000 })

    // Optional: Wait for loading to finish if loading indicator is present
    // This ensures we see fresh results but keeps dropdown open
    const isLoading = await this.isLoading()
    if (isLoading) {
      await this.waitForLoadingToFinish({ timeout: options?.timeout || 5000 })
    }
  }

  // Query methods
  async inputValue(): Promise<string> {
    return await this.input.inputValue()
  }

  async isDropdownVisible(): Promise<boolean> {
    return await this.dropdown.isVisible().catch(() => false)
  }

  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible().catch(() => false)
  }

  async hasSuggestion(text: string): Promise<boolean> {
    // await this.waitForSuggestions()
    return await this.getSuggestion(text)
      .isVisible()
      .catch(() => false)
  }

  async getSuggestionCount(): Promise<number> {
    // await this.waitForSuggestions()
    // Use role-based locator for list items
    const options = this.page.getByRole('option')
    const count = await options.count()
    // Fallback to li elements if no options found
    if (count === 0) {
      return await this.page.locator('li').count()
    }
    return count
  }

  async getAllSuggestions(): Promise<string[]> {
    // await this.waitForSuggestions()
    // Use role-based locator for options
    const options = this.dropdown.getByRole('option')
    const count = await options.count()

    if (count > 0) {
      return await options.allTextContents()
    }

    // Fallback to li elements
    return await this.dropdown.locator('li').allTextContents()
  }

  // Assertion helpers
  async expectToBeVisible(): Promise<void> {
    await expect(this.autocomplete).toBeVisible()
  }

  async expectToHaveSuggestion(text: string): Promise<void> {
    // await this.waitForSuggestions()
    await expect(this.getSuggestion(text)).toBeVisible()
  }

  async expectNotToHaveSuggestion(text: string): Promise<void> {
    // await this.waitForSuggestions()
    await expect(this.getSuggestion(text)).not.toBeVisible()
  }

  async expectValue(value: string): Promise<void> {
    await expect(this.input).toHaveValue(value)
  }

  async expectToBeEmpty(): Promise<void> {
    await expect(this.input).toHaveValue('')
  }

  async expectLoading(): Promise<void> {
    await expect(this.loadingIndicator).toBeVisible()
  }

  async expectNotLoading(): Promise<void> {
    await expect(this.loadingIndicator).not.toBeVisible()
  }
}
