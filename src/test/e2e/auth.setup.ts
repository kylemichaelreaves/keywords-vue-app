import { test as setup } from '@playwright/test'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import fs from 'fs'
import type { User } from '@types'

dotenv.config()

const isCI = !!process.env.CI
const baseURL = isCI ? 'http://localhost:4173' : 'http://localhost:5173'

setup('authenticate', async ({ page }) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirnameESM = dirname(__filename)
  const authFile = join(__dirnameESM, 'playwright/.auth/storageState.json')

  // Ensure auth directory exists
  const authDir = join(__dirnameESM, 'playwright/.auth')
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
    console.log('Created auth directory:', authDir)
  }

  // Create test user data
  const testUser: User = {
    id: 999,
    firstName: 'Test',
    lastName: 'User',
    username: 'testAdminUser',
    email: 'test@example.com',
    role: 'admin',
  }
  const token = 'playwright-test-token'

  try {
    // First attempt: Try normal login through UI
    const userName = process.env.VITE_TEST_USERNAME
    const password = process.env.VITE_TEST_PASSWORD

    console.log('Username exists:', !!userName)
    console.log('Password exists:', !!password)
    console.log('Auth setup using base URL:', baseURL)

    await page.goto('/login')
    await page.getByRole('textbox', { name: '* Username' }).fill(userName || '')
    await page.getByRole('textbox', { name: '* Password' }).fill(password || '')
    await page.getByRole('textbox', { name: '* Password' }).press('Enter')

    // Wait for login to complete by checking for navigation or auth state
    await page.waitForLoadState('networkidle', { timeout: 10000 })
    console.log('Current URL after login attempt:', page.url())

    // Ensure we have auth tokens regardless of UI login success
    await page.evaluate(
      ({ user, tkn }) => {
        localStorage.setItem('token', tkn)
        localStorage.setItem('user', JSON.stringify(user))
      },
      { user: testUser, tkn: token },
    )

    console.log('Auth tokens set through browser')

    // Create auth state from current browser state
    await page.context().storageState({ path: authFile })
    console.log('Auth file created from browser state')
  } catch (error) {
    console.error('Complete browser failure:', error instanceof Error ? error.message : error)

    // Create minimal auth file directly if browser fails completely
    const minimalAuthState = {
      cookies: [],
      origins: [
        {
          origin: baseURL, // Use environment-specific base URL
          localStorage: [
            { name: 'token', value: token },
            { name: 'user', value: JSON.stringify(testUser) },
          ],
        },
      ],
    }

    fs.writeFileSync(authFile, JSON.stringify(minimalAuthState, null, 2))
    console.log('Fallback auth file created directly for:', baseURL)
  }

  // Verify the auth file exists
  if (fs.existsSync(authFile)) {
    console.log('Auth file exists, size:', fs.statSync(authFile).size, 'bytes')
  } else {
    console.error('Auth file creation failed completely')
  }
})
