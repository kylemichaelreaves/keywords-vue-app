import {useQuery} from '@tanstack/vue-query'
import {fetchOFAmountDebit} from "@api/transactions/fetchOFAmountDebit";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";

// Get the Amount Debit for Memo's fitting the MJ category, for subsequent months
export function usePrevOFSummaries() {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    // TODO compute the dataType based on what's in the store
    const dateType = computed(() => "month");
    const queryKey = computed(() => ['PrevOFSummaries', dateType.value, selectedMonth.value]);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: async () => {
            const currentIndex = store.months.findIndex(month => month.month_year === selectedMonth.value);
            const monthSummaries = store.months.slice(currentIndex, currentIndex + 3);
            return await Promise.all(monthSummaries.map(async (month) => {
                const dateObj = parseDateMMYYYY(month.month_year);
                const OFSummary = await fetchOFAmountDebit(dateType.value, dateObj);
                return OFSummary as unknown as typeof OFSummary;
            }));
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        enabled: Boolean(store.selectedMonth) || Boolean(store.selectedWeek)
    })
}
