import type { User } from '@types'
import { httpClient } from '@api/httpClient.ts'

export async function createUser(user: User) {
  const response = await httpClient.post(`/users`, {
    user
  }, {
    headers: {
      'Content-Type': 'application/json'
    },
    baseURL: import.meta.env.VITE_LOCAL_APIGATEWAY_URL
  })

  if (!response) {
    throw new Error('Failed to create user')
  }

  return await response.data
}