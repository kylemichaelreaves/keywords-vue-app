import { geocodeAddress } from '@api/address/geocodeAddress'
import { vi, test, describe, afterEach, expect } from 'vitest'
import { addressesMock } from '@mocks/address'
import type { AddressFields } from '@types'

vi.mock('@api/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
  },
}))

import { httpClient } from '@api/httpClient'

const mockGet = vi.mocked(httpClient.get)

describe('geocodeAddress', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('geocodeAddress returns address data when a valid address is provided', async () => {
    mockGet.mockResolvedValue({ data: addressesMock })

    const address: AddressFields = {
      streetAddress: '123 Main St',
      unitOrAptNum: 'Apt 4B',
      municipality: 'New York',
      state: 'NY',
      zipcode: '10001',
    }

    const result = await geocodeAddress(address)

    expect(mockGet).toHaveBeenCalledWith('/addresses/geocoder', { params: address })
    expect(result).toEqual(addressesMock)
  })

  test('geocodeAddress rejects when the request fails', async () => {
    mockGet.mockRejectedValue(new Error('Network error'))

    const address: AddressFields = {
      streetAddress: '999 Nowhere St',
      municipality: 'Faketown',
      state: 'ZZ',
    }

    await expect(geocodeAddress(address)).rejects.toThrow('Network error')
    expect(mockGet).toHaveBeenCalledWith('/addresses/geocoder', { params: address })
  })
})
