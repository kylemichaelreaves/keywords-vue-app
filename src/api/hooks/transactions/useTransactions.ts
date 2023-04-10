import {useQuery} from '@tanstack/vue-query'
import {fetchTransactions} from '../../transactions/fetchTransactions'
import {Transaction} from "../../../types";
import {computed, Ref} from "vue";

interface UseTransactionsProps {
    LIMIT?: number,
    OFFSET?: number
    date?: string
}

export default function useTransactions(LIMIT = 100, OFFSET = 0, selectedMonthRef?: Ref<string>) {
    if (!selectedMonthRef) {
        console.log('selectedMonthRef was not passed to useTransactions')
    } else if (selectedMonthRef) {
        console.log('selectedMonthRef passed to useTransactions:', selectedMonthRef)
    }

    const queryKey = computed(() => ['transactions', LIMIT, OFFSET, selectedMonthRef]);

    console.log('queryKey:', queryKey.value)

    return useQuery<Array<Transaction>>({
        queryKey: queryKey.value,
        queryFn: () => fetchTransactions(LIMIT, OFFSET, selectedMonthRef?.value),
    })
}
