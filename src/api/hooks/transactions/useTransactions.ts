import {useInfiniteQuery} from '@tanstack/vue-query';
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

    return useInfiniteQuery<Array<Transaction>>({
        initialPageParam: 0,
        queryKey: ['transactions', LIMIT, selectedMemo.value, dateType.value, selectedValue.value],
        queryFn: async ({pageParam = 0}) => {
            console.log('pageParam:', pageParam);
            const dateObj = getJSDateObject(dateType.value, selectedValue.value);
            return await fetchTransactions({
                limit: LIMIT,
                offset: Number(pageParam),
                memo: selectedMemo.value,
                timeFrame: dateType.value,
                date: dateObj as unknown as Date,
            });
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < LIMIT) {
                return undefined;
            }
            return allPages.length * LIMIT;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5 // Cache for 5 minutes
    });
}
