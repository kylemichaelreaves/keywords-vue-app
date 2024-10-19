import {useQuery} from '@tanstack/vue-query'
import {computed} from 'vue';
import {useTransactionsStore} from '@stores/transactions';
import {fetchTransactions} from '@api/transactions/fetchTransactions';
import {getJSDateObject} from '@api/helpers/getJSDateObject';
import {getDateTypeAndValue} from '@components/transactions/getDateTypeAndValue';
import type {Transaction} from "@types";

export default function useTransactions(LIMIT: number, OFFSET: number) {
    const store = useTransactionsStore();
    const selectedMemo = computed(() => store.getSelectedMemo);

    const dateTypeAndValue = computed(() => getDateTypeAndValue());
    const dateType = computed(() => dateTypeAndValue.value.dateType);
    const selectedValue = computed(() => dateTypeAndValue.value.selectedValue);

    const cachedTransactions = computed(() => store.getTransactions);

    return useQuery<Array<Transaction>>({
        queryKey: [
            'transactions',
            LIMIT,
            OFFSET,
            selectedMemo.value,
            dateType.value,
            selectedValue.value
        ],
        queryFn: () => {
            if (cachedTransactions.value.length > 0) {
                return cachedTransactions.value;
            } else {
                const dateObj = getJSDateObject(dateType.value, selectedValue.value);
                const transactions = fetchTransactions({
                    limit: LIMIT,
                    offset: OFFSET,
                    memo: selectedMemo.value,
                    timeFrame: dateType.value,
                    date: dateObj as unknown as Date
                });
                store.setTransactions(transactions as unknown as Transaction[]);
                return transactions;
            }
        },
        refetchOnWindowFocus: false,
        // staleTime: 1000 * 60 * 5 // Cache for 5 minutes
    });
}
