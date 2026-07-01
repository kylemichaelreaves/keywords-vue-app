import { updateUser } from '@api/users/updateUser'
import { vi, test, describe, afterEach, expect } from 'vitest'
import type { User } from '@types'

vi.mock('@api/httpClient', () => ({
  httpClient: {
    put: vi.fn(),
  },
}))

import { httpClient } from '@api/httpClient'

const mockPut = vi.mocked(httpClient.put)

describe('updateUser', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('PUTs to /users/:id with the { user } envelope and returns response data', async () => {
    const updated = { id: 42, username: 'ada', email: 'ada@example.com' }
    mockPut.mockResolvedValue({ data: updated })

    const user: Partial<User> = { id: 42, username: 'ada', email: 'ada@example.com' }
    const result = await updateUser(user)

    expect(mockPut).toHaveBeenCalledWith('/users/42', { user })
    expect(result).toEqual(updated)
  })

  test('throws when user.id is missing (avoids PUT /users/undefined)', async () => {
    const user: Partial<User> = { username: 'ada', email: 'ada@example.com' }

    await expect(updateUser(user)).rejects.toThrow('updateUser requires user.id')
    expect(mockPut).not.toHaveBeenCalled()
  })

  test('throws when the request returns a falsy response', async () => {
    mockPut.mockResolvedValue(undefined)

    await expect(updateUser({ id: 1, username: 'x' })).rejects.toThrow('Failed to update user')
  })
})
