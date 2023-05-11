import {useQuery} from '@tanstack/vue-query'
import {fetchTransactions} from '../../transactions/fetchTransactions'
import {Transaction} from "../../../types";
import {computed} from "vue";
import {useTransactionsStore} from "../../../stores/transactionsStore";

export default function useTransactions(LIMIT = 100, OFFSET = 0) {
    const store = useTransactionsStore()
    const selectedMemo = computed(() => store.getSelectedMemo)
    const selectedMonth = computed(() => store.getSelectedMonth)

    const queryKey = computed(() => ['transactions', LIMIT, OFFSET, selectedMonth.value, selectedMemo.value]);

    return useQuery<Array<Transaction>>({
        queryKey: queryKey.value,
        queryFn: () => fetchTransactions(LIMIT, OFFSET, selectedMonth.value, selectedMemo.value),
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}
