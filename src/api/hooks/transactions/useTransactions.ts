import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from '@tanstack/vue-query'
import type {Transaction} from "@types";
import {computed} from "vue";
import {fetchTransactions} from '@api/transactions/fetchTransactions'
import {useTransactionsStore} from "@stores/transactions";
import {getDateObject} from "@api/helpers/getDateObj";

// TODO refactor limit - limit should be the length of the records for that query
export default function useTransactions(LIMIT: number, OFFSET?: number): UseQueryReturnType<Transaction[], Error> {
    const store = useTransactionsStore()
    const selectedDay = computed(() => store.getSelectedDay)
    const selectedWeek = computed(() => store.getSelectedWeek)
    const selectedMonth = computed(() => store.getSelectedMonth)
    const selectedMemo = computed(() => store.getSelectedMemo)
    const dateType = computed(() => {
        return selectedDay.value ? "day" :
            selectedWeek.value ? "week" :
                selectedMonth.value ? "month" : undefined
    });

    const queryKey = computed(() => [
        'transactions',
        LIMIT,
        OFFSET,
        selectedMemo.value,
        dateType.value,
        selectedMonth.value,
        selectedWeek.value
    ]);

    return useQuery<Array<Transaction>>({
        queryKey: queryKey.value,
        queryFn: () => {
            // Convert the date string to a Date object based on the dateType
            // TODO - include a case for dateType === "year"
            const selectedValue =
                dateType.value === "week" ? selectedWeek.value :
                    dateType.value === "month" ? selectedMonth.value :
                        dateType.value === "day" ? selectedDay.value : null;

            const dateObj = getDateObject(dateType.value, selectedValue);

            return fetchTransactions({
                limit: LIMIT,
                offset: OFFSET,
                memo: selectedMemo.value,
                timeFrame: dateType.value,
                date: dateObj
            });
        },
        refetchOnWindowFocus: false
    })
}
