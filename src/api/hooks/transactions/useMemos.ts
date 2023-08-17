import {useQuery} from '@tanstack/vue-query'
import {fetchMemos} from "@/api/transactions/fetchMemos";
import type {Memo} from "@/types";
import {useTransactionsStore} from "@/stores/transactionsStore";
import {computed} from "vue";

export default function useMemos() {
    const store = useTransactionsStore()

    const selectedMonth = computed(() => store.getSelectedMonth)

    const queryKeyText = computed(() => ['memos', selectedMonth.value])

    return useQuery<Array<Memo>>({
        queryKey: ['memos', queryKeyText.value],
        queryFn: () => fetchMemos(selectedMonth.value),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
}
