import { useQuery } from '@tanstack/vue-query'
import { getUser } from '@api/users/getUser.ts'
import type { User } from '@types'

export async function useUser(userId: User['id']) {
  return useQuery({ queryKey: ['user', userId], queryFn: () => getUser(userId) })
}
