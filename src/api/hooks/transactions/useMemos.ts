import {useQuery} from '@tanstack/vue-query'
import {fetchMemos} from "../../transactions/fetchMemos";
import {Memo} from "../../../types";
import {useTransactionsStore} from "../../../stores/transactionsStore";
import {computed} from "vue";

export default function useMemos() {
    const store = useTransactionsStore()

    const selectedMonth = computed(() => store.getSelectedMonth)

    if (!selectedMonth.value) {
        console.log('selectedMonth was not passed to useMemos')
    } else if (selectedMonth.value) {
        console.log('selectedMonth passed to useMemos:', selectedMonth.value)
    }

    const queryKeyText = computed(() => ['memos', selectedMonth.value])

    console.log('queryKeyText:', queryKeyText.value)

    return useQuery<Array<Memo>>({
        queryKey: ['memos', queryKeyText],
        queryFn: () => fetchMemos(selectedMonth.value),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
}
