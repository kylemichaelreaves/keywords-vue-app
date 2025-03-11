import { test as setup } from '@playwright/test'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url';


setup('setup', async ({ playwright, page }) => {

  // const authFile = path.join(__dirname, '../playwright/.auth/storageState.json')
  const __filename = fileURLToPath(import.meta.url);
  const __dirnameESM = dirname(__filename);

  const authFile = join(__dirnameESM, 'playwright/.auth/storageState.json');

  const userName = process.env.TEST_USERNAME
  const password = process.env.TEST_PASSWORD

  await page.goto('http://localhost:5173/')
  await page.getByText('budget-visualizer').click()
  await page.getByRole('textbox', { name: '* Username' }).click()
  await page.getByRole('textbox', { name: '* Username' }).fill(userName ? userName : '')
  await page.getByRole('textbox', { name: '* Username' }).press('Tab')
  await page.getByRole('textbox', { name: '* Password' }).fill(password ? password : '')
  await page.getByRole('textbox', { name: '* Password' }).press('Enter')
  await page.goto('http://localhost:5173/budget-visualizer')

  await page.context().storageState({ path: authFile })

  await page.close()
})
