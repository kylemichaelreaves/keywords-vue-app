import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from '@tanstack/vue-query'
import {computed} from "vue";
import {fetchTransactionsCount} from '@api/transactions/fetchTransactionsCount'
import {useTransactionsStore} from "@stores/transactions";
import {getDateObject} from "@api/helpers/getDateObj";

export default function useTransactionsCount(): UseQueryReturnType<number, Error> {
    const store = useTransactionsStore()
    const selectedDay = computed(() => store.getSelectedDay)
    const selectedWeek = computed(() => store.getSelectedWeek)
    const selectedMonth = computed(() => store.getSelectedMonth)
    const dateType = computed(() => {
        return selectedDay.value ? "day" :
            selectedWeek.value ? "week" :
                selectedMonth.value ? "month" : undefined
    });

    const queryKey = computed(() => {
        let key = ['transactionsCount'];
        if (selectedDay.value) {
            key.push(selectedDay.value);
        } else if (selectedWeek.value) {
            key.push(selectedWeek.value);
        } else if (selectedMonth.value) {
            key.push(selectedMonth.value);
        }
        return key;
    });

    return useQuery<number>({
        queryKey: ['transactionsCount', queryKey.value],
        queryFn: () => {
            // Convert the date string to a Date object based on the dateType
            // TODO - include a case for dateType === "year"
            const selectedValue =
                dateType.value === "week" ? selectedWeek.value :
                    dateType.value === "month" ? selectedMonth.value :
                        dateType.value === "day" ? selectedDay.value : null;
            const dateObj = getDateObject(dateType.value, selectedValue);
            return fetchTransactionsCount(dateType.value, dateObj)
        },
        refetchOnWindowFocus: false
    })
}