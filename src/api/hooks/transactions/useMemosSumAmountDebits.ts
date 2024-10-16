import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchMemosSumAmountDebits} from "@api/transactions/fetchMemosSumAmountDebits";
import {useTransactionsStore} from "@stores/transactions";
import type {MemoSumAmountDebits} from "@types";

// TODO figure out why we are passing LIMIT and OFFSET here but not Memo???
export default function useMemosSumAmountDebits(LIMIT: number, OFFSET: number): UseQueryReturnType<MemoSumAmountDebits[], Error> {
    const store = useTransactionsStore()
    const memo = store.getSelectedMemo
    return useQuery({
        queryKey: ['memosSumAmountDebits', LIMIT, OFFSET],
        queryFn: () => fetchMemosSumAmountDebits(LIMIT, OFFSET),
        refetchOnWindowFocus: false,
        enabled: !!memo
    })
}