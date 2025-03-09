import { test as setup } from '@playwright/test'

setup('db setup', async ({ playwright, page }) => {

  const userName = process.env.TEST_USERNAME
  const password = process.env.TEST_PASSWORD

  await page.goto('http://localhost:5173/')
  await page.getByText('budget-visualizer').click()
  await page.getByRole('textbox', { name: '* Username' }).click()
  await page.getByRole('textbox', { name: '* Username' }).fill(userName)
  await page.getByRole('textbox', { name: '* Username' }).press('Tab')
  await page.getByRole('textbox', { name: '* Password' }).fill(password)
  await page.getByRole('textbox', { name: '* Password' }).press('Enter')
  await page.goto('http://localhost:5173/budget-visualizer')


})
