import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from '@tanstack/vue-query'
import type {TimeframeType, Transaction} from "@types";
import {computed} from "vue";
import {fetchTransactions} from '@api/transactions/fetchTransactions'
import {useTransactionsStore} from "@stores/transactions";
import {getDateObject} from "@api/helpers/getDateObj";
import {getDateTypeAndValue} from "@components/transactions/getDateTypeAndValue";

export default function useTransactions(LIMIT: number, OFFSET?: number): UseQueryReturnType<Transaction[], Error> {
    const store = useTransactionsStore()
    const selectedMemo = computed(() => store.getSelectedMemo)
    const {dateType, selectedValue} = getDateTypeAndValue();

    console.log('dateType', dateType);
    console.log('selectedValue', selectedValue);

    const queryKey = computed(() => [
        'transactions',
        LIMIT,
        OFFSET,
        selectedMemo.value,
        dateType,
        selectedValue?.value
    ]);

    return useQuery<Array<Transaction>>({
        queryKey: queryKey.value,
        queryFn: () => {
            const dateObj = getDateObject(dateType, selectedValue);
            return fetchTransactions({
                limit: LIMIT,
                offset: OFFSET,
                memo: selectedMemo.value,
                timeFrame: dateType as TimeframeType,
                date: dateObj
            });
        },
        refetchOnWindowFocus: false
    })
}
