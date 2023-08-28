import {useQuery} from '@tanstack/vue-query';
import {fetchMemoSummary} from "../../transactions/fetchMemoSummary";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";

export default function useMemoSummary() {
    const store = useTransactionsStore()
    const selectedMemo = computed(() => store.getSelectedMemo)

    return useQuery({
        queryKey: ['memoSummary', selectedMemo.value],
        queryFn: () => fetchMemoSummary(selectedMemo.value),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        // Only execute the query if selectedMemo.value is not null or undefined
        enabled: !!selectedMemo.value
    })
}