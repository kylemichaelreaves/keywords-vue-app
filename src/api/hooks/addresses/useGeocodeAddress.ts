import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { geocodeAddress } from '../../address/geocodeAddress'
import type { AddressFields } from '@types'

export default function useGeocodeAddress(address: MaybeRefOrGetter<AddressFields>) {
  return useQuery({
    queryKey: ['address-geocode'],
    queryFn: () => geocodeAddress(toValue(address)),
    enabled: false,
    gcTime: 0,
  })
}
