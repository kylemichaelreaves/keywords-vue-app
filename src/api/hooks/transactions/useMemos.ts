import {useQuery} from '@tanstack/vue-query'
import {fetchMemos} from "@api/transactions/fetchMemos";
import type {Memo} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";

export default function useMemos(): UseQueryReturnType<Memo[], Error> {
    const store = useTransactionsStore();
    const cachedMemos = computed(() => store.getMemos);
    return useQuery<Array<Memo>>({
        queryKey: ['memos'],
        queryFn: async () => {

            if (cachedMemos.value.length > 0) {
                return cachedMemos.value
            } else {
                const memos = fetchMemos()
                store.setMemos(await memos)
                return memos
            }

        },
        refetchOnWindowFocus: false,
    })
}
