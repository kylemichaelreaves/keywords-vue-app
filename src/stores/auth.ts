import { defineStore } from 'pinia'
import type { PersistedUser, User } from '@types'
import { httpClient } from '@api/httpClient.ts'

const emptyUser: PersistedUser = {
  id: 0,
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  role: 'guest',
}

export const useAuthStore = defineStore('auth', {
  state: (): {
    token: string
    user: PersistedUser
    isUserAuthenticated: boolean
  } => ({
    token: '',
    user: { ...emptyUser },
    isUserAuthenticated: false,
  }),
  getters: {
    getToken(state) {
      return state.token
    },
    getUser(state) {
      return state.user
    },
    getIsUserAuthenticated(state) {
      return state.isUserAuthenticated
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(user: PersistedUser | User) {
      const { password, confirmPassword, ...safe } = user as User
      void password
      void confirmPassword
      this.user = safe
    },
    setIsUserAuthenticated(isUserAuthenticated: boolean) {
      this.isUserAuthenticated = isUserAuthenticated
    },
    async login(email: User['email'], password: User['password']) {
      return await httpClient
        .post('/login', {
          email,
          password,
        })
        .then((response) => {
          return response.data
        })
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.setToken('')
      this.setIsUserAuthenticated(false)
      this.setUser({ ...emptyUser })
    },
  },
})
