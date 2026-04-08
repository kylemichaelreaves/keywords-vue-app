import { httpClient } from '@api/httpClient.ts'
import type { User } from '@types'

export async function deleteUser(userId: User['id']) {
  const response = await httpClient.delete(`/users/${userId}`)
  return response.data
}
