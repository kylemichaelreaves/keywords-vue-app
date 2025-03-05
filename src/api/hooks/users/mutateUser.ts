import { useMutation } from '@tanstack/vue-query'
import type { User } from '@types'
import { useRouter } from 'vue-router'
import { createUser } from '@api/users/createUser.ts'
import { deleteUser } from '@api/users/deleteUser.ts'
import { updateUser } from '@api/users/updateUser.ts'
import { getUser } from '@api/users/getUser.ts'

type MutationType = 'create' | 'delete' | 'update' | 'login';

export async function mutateUser(user: User, mutationType: MutationType) {
  const router = useRouter()
  const mutationFn = () => {
    switch (mutationType) {
      case 'create':
        return createUser(user);
      case 'delete':
        return deleteUser(user.id);
      case 'update':
        return updateUser(user);
      case 'login':
        return getUser(user.id);

      default:
        throw new Error('Invalid mutation type');
    }
  };

  return useMutation({
    mutationFn,
    mutationKey: [mutationType, 'user'],
    onError: (error) => {
      console.error(`Error ${mutationType} user:`, error)
    },
    onSuccess: (data) => {
      console.log(`User ${mutationType}d successfully:`, data)
      if (mutationType === 'create') {
        // redirect to the login page with the router
        router.push('/login')
      }
    }
  })
}