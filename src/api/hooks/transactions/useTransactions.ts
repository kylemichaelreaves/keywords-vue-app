import {useQuery} from '@tanstack/vue-query'
import {fetchTransactions} from '../../transactions/fetchTransactions'
import {Transaction} from "../../../types";
import {computed} from "vue";
import {useTransactionsStore} from "../../../stores/transactionsStore";

interface UseTransactionsProps {
    LIMIT?: number,
    OFFSET?: number
    selectedMonthRef?: string
}

export default function useTransactions(LIMIT = 100, OFFSET = 0) {
    const store = useTransactionsStore()
    const selectedMonthRef = computed(() => store.getSelectedMonth)

    if (!selectedMonthRef) {
        console.log('selectedMonthRef was not passed to useTransactions')
    } else if (selectedMonthRef) {
        console.log('selectedMonthRef passed to useTransactions:', selectedMonthRef)
    }

    const queryKey = computed(() => ['transactions', LIMIT, OFFSET, selectedMonthRef.value]);

    console.log('queryKey:', queryKey.value)

    return useQuery<Array<Transaction>>({
        queryKey: queryKey.value,
        queryFn: () => fetchTransactions(LIMIT, OFFSET, selectedMonthRef.value),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
}
