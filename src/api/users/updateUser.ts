import type { User } from '@types'
import { httpClient } from '@api/httpClient.ts'

export async function updateUser(user: Partial<User>) {
  if (user.id === undefined || user.id === null) {
    throw new Error('updateUser requires user.id')
  }

  const response = await httpClient.put(`/users/${user.id}`, { user })

  if (!response) {
    throw new Error('Failed to update user')
  }

  return await response.data
}
