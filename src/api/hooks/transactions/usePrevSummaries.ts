import {useQuery} from '@tanstack/vue-query'
import {fetchOFAmountDebit} from "../../transactions/fetchOFAmountDebit";
import {useTransactionsStore} from "../../../stores/transactionsStore";
import {computed} from "vue";
import {fetchMJAmountDebit} from "../../transactions/fetchMJAmountDebit";
import {parseDateMMYYYY} from "../../helpers/dataUtils";

// Get the Amount Debit for Memo's fitting the MJ category, for subsequent months
export function usePrevSummaries() {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    const dateType = computed(() => "month");
    const queryKey = computed(() => ['PrevSummaries', dateType.value, selectedMonth.value]);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: async () => {
            const currentIndex = store.months.findIndex(month => month.month_year === selectedMonth.value);
            const monthSummaries = store.months.slice(currentIndex, currentIndex + 3);

            const summaries = [];
            for (let month of monthSummaries) {
                const dateObj = parseDateMMYYYY(month.month_year);

                const MJSummary = await fetchMJAmountDebit(dateType.value, dateObj);
                const OFSummary = await fetchOFAmountDebit(dateType.value, dateObj);

                const identifiedMJSummary = {...MJSummary, source: 'MJ'};
                const identifiedOFSummary = {...OFSummary, source: 'OF'};

                // flatten arrays and combine them
                summaries.push(identifiedMJSummary, identifiedOFSummary);
            }

            // filtering out duplicate values based on your business logic
            return summaries;
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        enabled: selectedMonth.value !== ''
    })
}
