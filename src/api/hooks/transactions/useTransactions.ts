import {useInfiniteQuery} from '@tanstack/vue-query';
import {computed, watch} from 'vue';
import {useTransactionsStore} from '@stores/transactions';
import {fetchTransactions} from '@api/transactions/fetchTransactions';
import {getJSDateObject} from '@api/helpers/getJSDateObject';
import {getDateTypeAndValue} from '@components/transactions/getDateTypeAndValue';
import type {Transaction} from '@types';

export default function useTransactions(LIMIT: number) {
    const store = useTransactionsStore();
    const selectedMemo = computed(() => store.getSelectedMemo);
    const dateTypeAndValue = computed(() => getDateTypeAndValue());
    const dateType = computed(() => dateTypeAndValue.value.dateType);
    const selectedValue = computed(() => dateTypeAndValue.value.selectedValue);

    const infiniteQuery = useInfiniteQuery<Array<Transaction>>({
        initialPageParam: 0,
        queryKey: ['transactions', LIMIT, selectedMemo.value, dateType.value, selectedValue.value],
        queryFn: async ({pageParam = 0}) => {
            const dateObj = getJSDateObject(dateType.value, selectedValue.value);
            const cachedTransactions = store.getTransactionsByOffset(Number(pageParam));
            if (cachedTransactions && cachedTransactions.length > 0) {
                return cachedTransactions;
            } else {
                const transactions = await fetchTransactions({
                    limit: LIMIT,
                    offset: Number(pageParam),
                    memo: selectedMemo.value,
                    timeFrame: dateType.value,
                    date: dateObj as Date,
                });
                store.setTransactionsByOffset(Number(pageParam), transactions);
                return transactions;
            }
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < LIMIT) {
                return undefined;
            }
            return allPages.length * LIMIT;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    watch(
        [selectedMemo, dateType, selectedValue],
        () => {
            store.clearTransactionsByOffset();
            infiniteQuery.refetch().then(
                () => {
                    console.log('refetched');
                },
                (err) => {
                    console.log('error:', err);
                }
            );
        },
        {immediate: true}
    );

    return {
        ...infiniteQuery,
    };
}
