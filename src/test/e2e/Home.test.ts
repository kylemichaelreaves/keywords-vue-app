import { test, expect } from '@playwright/test'
import { HomePage } from './pages/HomePage'
import { BudgetVisualizerPage } from './pages/BudgetVisualizerPage'

test('Check localStorage', async ({ page }) => {
  await page.goto('/')
  const token = await page.evaluate(() => localStorage.getItem('token'))
  console.log('Token in test:', token)
})

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Vite + Vue + TS')
})

test('can go to the budget-visualizer tab', async ({ page }) => {
  const homePage = new HomePage(page)
  const budgetVisualizerPage = new BudgetVisualizerPage(page)

  await homePage.goto()
  await homePage.navigateToTab('budget-visualizer')
  await budgetVisualizerPage.expectPageLoaded()
})

test('the Home page displays all of the relevant text', async ({ page }) => {
  const homePage = new HomePage(page)

  await page.goto(`/budget-visualizer`)
  await homePage.navigateToHome()
  await expect(page.getByText('budget-visualizer')).toBeVisible()
  await homePage.expectHomePageContent()
})

test('theme toggle functionality works correctly', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()
  await homePage.expectThemeToggleVisible()

  // Check initial theme state
  const initialHtmlClass = await homePage.getHtmlClass()
  const initialTheme = await homePage.getThemeFromLocalStorage()
  console.log('Initial theme class:', initialHtmlClass)
  console.log('Initial theme in localStorage:', initialTheme)

  // Click the theme toggle to switch themes
  await homePage.toggleTheme()

  // Wait for localStorage to be updated (which triggers the theme change)
  await homePage.waitForThemeToNotBe(initialTheme)

  // Check that the HTML class has changed
  const newHtmlClass = await homePage.getHtmlClass()
  const newTheme = await homePage.getThemeFromLocalStorage()
  console.log('New theme class:', newHtmlClass)
  console.log('New theme in localStorage:', newTheme)

  expect(newHtmlClass).not.toBe(initialHtmlClass)
  expect(newTheme).not.toBe(initialTheme)

  // Verify theme classes are applied correctly
  if (newTheme) {
    await homePage.expectThemeClass(newTheme)
  }

  // Toggle back to verify it works both ways
  await homePage.toggleTheme()
  await homePage.waitForThemeChange(initialTheme!)

  // Verify we're back to the original theme
  const finalHtmlClass = await homePage.getHtmlClass()
  expect(finalHtmlClass).toBe(initialHtmlClass)
})

test('theme toggle persists across page reloads', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()

  // Get initial theme
  const initialTheme = await homePage.getThemeFromLocalStorage()

  // Toggle the theme
  await homePage.toggleTheme()
  await homePage.waitForThemeToNotBe(initialTheme)

  // Get the new theme value
  const newTheme = await homePage.getThemeFromLocalStorage()

  // Reload the page
  await homePage.reload()

  // Verify the theme persisted after reload
  const persistedTheme = await homePage.getThemeFromLocalStorage()
  expect(persistedTheme).toBe(newTheme)

  // Verify the HTML class matches the persisted theme
  if (persistedTheme) {
    await homePage.expectThemeClass(persistedTheme)
  }
})
