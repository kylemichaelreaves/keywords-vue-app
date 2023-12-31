import {useQuery} from '@tanstack/vue-query';
import {fetchMemoSummary} from "@api/transactions/fetchMemoSummary";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import type {MemoSummary} from "@types";

export default function useMemoSummary(): UseQueryReturnType<MemoSummary, Error> {
    const store = useTransactionsStore()
    const selectedMemo = computed(() => store.getSelectedMemo)

    return useQuery({
        queryKey: ['memoSummary', selectedMemo.value],
        queryFn: () => fetchMemoSummary(selectedMemo.value),
        refetchOnWindowFocus: false,
        // Only execute the query if selectedMemo.value is not null or undefined
        enabled: !!selectedMemo.value
    })
}