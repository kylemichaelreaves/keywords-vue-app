import {useQuery} from '@tanstack/vue-query'
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import {fetchMJAmountDebit} from "@api/transactions/fetchMJAmountDebit";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";

// Get the Amount Debit for Memo's fitting the MJ category, for subsequent months
export function usePrevMJSummaries() {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    const dateType = computed(() => "month");
    const queryKey = computed(() => ['PrevMJSummaries', dateType.value, selectedMonth.value]);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: async () => {
            // find where the selectedMonth is in our months array
            const currentIndex = store.months.findIndex(month => month.month_year === selectedMonth.value);
            // get the next 3 months
            const monthsToFetch = store.months.slice(currentIndex, currentIndex + 3);
            const [results] = await Promise.all([Promise.all(monthsToFetch.map(async (month) => {
                const monthYear = month.month_year;

                // check if the month is already in the store
                const existingSummaryIndex = store.MJSummaries.findIndex((summary) => {
                    const summaryMonthYear = `${summary?.month_number?.padStart(2, '0')}/${summary.year}`;
                    return summaryMonthYear === monthYear;
                });

                if (existingSummaryIndex !== -1) {
                    console.log('found existing summary:', store.MJSummaries[existingSummaryIndex]);
                    // if the data is already in the store, return it
                    return store.MJSummaries[existingSummaryIndex];
                } else {
                    // if not, fetch the data
                    const dateObj = parseDateMMYYYY(monthYear);
                    console.log('fetching new summary for:', dateObj);
                    const MJSummary = await fetchMJAmountDebit(dateType.value, dateObj);
                    console.log('fetched new summary:', MJSummary);
                    // update the store
                    store.setMJSummaries([...store.MJSummaries, ...MJSummary as unknown as typeof MJSummary[]]);

                    return MJSummary;
                }
            }))]);

            return results;
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        enabled: Boolean(store.selectedMonth)
    })
}
