import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { geocodeAddress } from '../../address/geocodeAddress'
import type { AddressFields } from '@types'

export default function useGeocodeAddress(address: MaybeRefOrGetter<AddressFields>) {
  return useQuery({
    queryKey: computed(() => ['address-geocode', toValue(address)]),
    queryFn: () => geocodeAddress(toValue(address)),
    enabled: false,
  })
}
