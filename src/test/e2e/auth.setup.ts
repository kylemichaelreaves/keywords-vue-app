import { test as setup } from '@playwright/test'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()


setup('authenticate', async ({ page }) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirnameESM = dirname(__filename)

  const authFile = join(__dirnameESM, 'playwright/.auth/storageState.json')

  const userName = process.env.VITE_TEST_USERNAME
  const password = process.env.VITE_TEST_PASSWORD

  console.log('userName:', userName)
  console.log('password:', password)

  // ensure auth dir exists
  const authDir = join(__dirnameESM, 'playwright/.auth')
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
    console.log('Created auth directory:', authDir)
  }


  await page.goto('/login')

  await page.getByRole('textbox', { name: '* Username' }).click()
  await page.getByRole('textbox', { name: '* Username' }).fill(userName ? userName : '')
  await page.getByRole('textbox', { name: '* Username' }).press('Tab')
  await page.getByRole('textbox', { name: '* Password' }).fill(password ? password : '')
  await page.getByRole('textbox', { name: '* Password' }).press('Enter')

  await page.waitForURL('/budget-visualizer/transactions', {
    timeout: 60000,
  })

  await page.context().storageState({ path: authFile })

  console.log('Auth file created at:', authFile)
  console.log('Auth file exists:', fs.existsSync(authFile))

})
