import { httpClient } from '@api/httpClient.ts'
import type { User } from '@types'

export async function deleteUser(userId: User['id']) {
  const response = await httpClient.delete(`/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response) {
    throw new Error('Failed to delete user')
  }

  return await response.data
}