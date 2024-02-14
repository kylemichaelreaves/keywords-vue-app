import {useQuery} from '@tanstack/vue-query'
import {fetchMJAmountDebit} from "@api/transactions/fetchMJAmountDebit";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import type {MJSummary} from "@types";

// Get the Amount Debit for Memo's fitting the MJ category, for a certain period of time
export default function useMJAmountDebit(): UseQueryReturnType<MJSummary, Error> {

    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    const selectedWeek = computed(() => store.getSelectedWeek)
    const timeFrame = computed(() => selectedWeek.value ? "week" : "month");
    const queryKey = computed(() => ['MJAmountDebit', timeFrame.value, selectedMonth.value, selectedWeek.value]);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: () => {
            let dateObj: Date | null = null;
            if (timeFrame.value === "week" && selectedWeek.value) {
                dateObj = parseDateIWIYYY(selectedWeek.value);
            } else if (timeFrame.value === "month" && selectedMonth.value) {
                dateObj = parseDateMMYYYY(selectedMonth.value);
            }

            if (!dateObj) {
                throw new Error("Invalid date");
            }

            return fetchMJAmountDebit(timeFrame.value, dateObj);
        },
        refetchOnWindowFocus: false,
        enabled: selectedMonth.value !== ''
    })
}