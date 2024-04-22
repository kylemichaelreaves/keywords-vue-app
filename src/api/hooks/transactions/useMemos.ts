import {useQuery} from '@tanstack/vue-query'
import {fetchMemos} from "@api/transactions/fetchMemos";
import type {Memo} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";

export default function useMemos(): UseQueryReturnType<Memo[], Error> {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    // TODO: update to account for selectedYear, selectedWeek, selectedDay
    const queryKeyText = computed(() => ['memos', selectedMonth.value])

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
