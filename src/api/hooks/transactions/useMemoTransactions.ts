import type {Memo, Transaction} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {useQuery} from "@tanstack/vue-query";
import {fetchMemoTransactions} from "@api/transactions/fetchMemoTransactions";

export default function useMemoTransactions(memo: Memo): UseQueryReturnType<Transaction[], Error> {
    return useQuery({
        queryKey: ['memoTransactions', memo],
        queryFn: () => fetchMemoTransactions(memo),
        refetchOnWindowFocus: false,
        enabled: !!memo
    })
}