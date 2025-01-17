import type {Memo, Transaction} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {useQuery} from "@tanstack/vue-query";
import {fetchMemoTransactions} from "@api/transactions/fetchMemoTransactions";

export default function useMemoTransactions(memoName: Memo['name']): UseQueryReturnType<Transaction, Error> {
    return useQuery({
        queryKey: ['memoTransactions', memoName],
        queryFn: () => fetchMemoTransactions(memoName),
        refetchOnWindowFocus: false,
        enabled: !!memoName
    })
}