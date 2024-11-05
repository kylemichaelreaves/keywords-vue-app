import {useInfiniteQuery} from '@tanstack/vue-query';
import {computed} from 'vue';
import {useTransactionsStore} from '@stores/transactions';
import {fetchTransactions} from '@api/transactions/fetchTransactions';
import {getJSDateObject} from '@api/helpers/getJSDateObject';
import {getDateTypeAndValue} from '@components/transactions/getDateTypeAndValue';
import type {Transaction} from '@types';

export default function useTransactions() {

    const store = useTransactionsStore();
    const selectedMemo = computed(() => store.getSelectedMemo);
    const dateTypeAndValue = computed(() => getDateTypeAndValue());
    const dateType = computed(() => dateTypeAndValue.value.dateType);
    const selectedValue = computed(() => dateTypeAndValue.value.selectedValue);
    const limit = computed(() => store.getTransactionsTableLimit);

    return useInfiniteQuery<Array<Transaction>>({
        initialPageParam: 0,
        queryKey: ['transactions', limit.value, selectedMemo.value, dateType.value, selectedValue.value],
        queryFn: async ({pageParam = 0}) => {
            const dateObj = getJSDateObject(dateType.value, selectedValue.value);
            const cachedTransactions = store.getTransactionsByOffset(Number(pageParam));
            if (cachedTransactions && cachedTransactions.length > 0) {
                return cachedTransactions;
            } else {
                const transactions = await fetchTransactions({
                    limit: limit.value,
                    offset: Number(pageParam),
                    memo: selectedMemo.value,
                    timeFrame: dateType.value,
                    date: dateObj as unknown as Date,
                });
                store.setTransactionsByOffset(Number(pageParam), transactions);
                return transactions;
            }
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < limit.value) {
                return undefined;
            }
            return allPages.length * limit.value;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
}
