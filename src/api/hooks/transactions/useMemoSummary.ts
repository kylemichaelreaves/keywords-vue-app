import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {computed} from "vue";
import {fetchMemoSummary} from "@api/transactions/fetchMemoSummary";
import {useTransactionsStore} from "@stores/transactions";
import type {MemoSummary} from "@types";

// TODO part of the Memo's summary has to be whether or not it has a budget category assigned to it
//
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