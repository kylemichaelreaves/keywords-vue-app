import {useQuery} from '@tanstack/vue-query'
import {geocodeAddress} from "../geocodeAddress";
import {AddressFields} from "../../../types";

export default function useGeocodeAddress(address: AddressFields) {
    return useQuery({
        queryKey: ['address', address],
        queryFn: () => geocodeAddress(address),
        enabled: false
    })
}