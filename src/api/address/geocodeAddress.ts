import { httpClient } from '@api/httpClient'
import type { AddressFields, AddressResponse } from '@types'

export const geocodeAddress = async (address: AddressFields): Promise<AddressResponse[]> => {
  const res = await httpClient.get<AddressResponse[]>('/addresses/geocoder', {
    params: address,
  })
  return res.data
}
