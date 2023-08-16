import {useQuery} from '@tanstack/vue-query'
import {geocodeAddress} from "../../address/geocodeAddress";
import {AddressFields} from "@types/types";

export default function useGeocodeAddress(address: AddressFields) {
    return useQuery({
        queryKey: ['address', address],
        queryFn: () => geocodeAddress(address),
        enabled: false
    })
}