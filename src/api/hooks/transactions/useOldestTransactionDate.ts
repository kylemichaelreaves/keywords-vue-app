import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from '@tanstack/vue-query'
import fetchOldestTransactionDate from "@api/transactions/fetchOldestTransactionDate";

export default function useOldestTransactionDate(): UseQueryReturnType<string, Error> {
    return useQuery<string>({
        queryKey: ['oldest-transaction-date'],
        queryFn: () => fetchOldestTransactionDate(),
        refetchOnWindowFocus: false
    })
}