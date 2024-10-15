import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from '@tanstack/vue-query'
import type {Transaction} from "@types";
import {fetchTransaction} from "@api/transactions/fetchTransaction";

export default function useTransaction(transactionNumber: string): UseQueryReturnType<Transaction, Error> {
    return useQuery<Transaction>({
        queryKey: ['transaction', transactionNumber],
        queryFn: () => fetchTransaction(transactionNumber),
        refetchOnWindowFocus: false
    })
}