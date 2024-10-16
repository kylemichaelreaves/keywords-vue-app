import {useQuery} from '@tanstack/vue-query'
import {fetchMemos} from "@api/transactions/fetchMemos";
import type {Memo} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {useTransactionsStore} from "@stores/transactions";

export default function useMemos(): UseQueryReturnType<Memo[], Error> {
    const store = useTransactionsStore()

    return useQuery<Array<Memo>>({
        queryKey: ['memos'],
        queryFn: async () => {
            const memos = fetchMemos()
            store.setMemos(await memos)
            return memos
        },
        refetchOnWindowFocus: false,
    })
}
