import {useQuery} from '@tanstack/vue-query'
import {fetchTransactions} from '../../transactions/fetchTransactions'
import {Transaction} from "../../../types";
import {computed} from "vue";
import {useTransactionsStore} from "../../../stores/transactionsStore";

export default function useTransactions(LIMIT = 100, OFFSET = 0) {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    const selectedMemo = computed(() => store.getSelectedMemo)

    if (!selectedMonth.value) {
        console.log('selectedMonth was not passed to useTransactions')
    } else if (selectedMonth.value) {
        console.log('selectedMonth passed to useTransactions:', selectedMonth.value)
    }

    if (!selectedMemo.value) {
        console.log('selectedMemo was not passed to useTransactions')
    } else if (selectedMemo.value) {
        console.log('selectedMemo passed to useTransactions:', selectedMemo.value)
    }

    const queryKey = computed(() => ['transactions', LIMIT, OFFSET, selectedMonth.value, selectedMemo.value]);

    console.log('queryKey:', queryKey.value)

    return useQuery<Array<Transaction>>({
        queryKey: queryKey.value,
        queryFn: () => fetchTransactions(LIMIT, OFFSET, selectedMonth.value, selectedMemo.value),
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}
