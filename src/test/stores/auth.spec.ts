import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@stores/auth.ts'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('logout clears localStorage, token, and auth flag', () => {
    const store = useAuthStore()
    store.setToken('secret-token')
    store.setIsUserAuthenticated(true)
    store.setUser({
      id: 1,
      username: 'alice',
      firstName: 'A',
      lastName: 'B',
      email: 'a@example.com',
      role: 'user',
    })
    localStorage.setItem('token', 'secret-token')
    localStorage.setItem('user', JSON.stringify({ username: 'alice' }))

    store.logout()

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(store.token).toBe('')
    expect(store.isUserAuthenticated).toBe(false)
    expect(store.user.username).toBe('')
    expect(store.user.role).toBe('guest')
  })
})
