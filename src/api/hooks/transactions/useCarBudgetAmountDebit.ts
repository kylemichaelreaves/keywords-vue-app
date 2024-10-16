import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from '@tanstack/vue-query';
import fetchCarBudget from "@api/transactions/fetchCarBudget";
import type {CarBudget} from "@types";
import {computed} from "vue";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import {useTransactionsStore} from "@stores/transactions";
import {Timeframe} from "@types";

export default function useCarBudgetAmountDebit(): UseQueryReturnType<CarBudget, Error> {
    const store = useTransactionsStore();
    const selectedMonth = computed(() => store.getSelectedMonth)
    const timeFrame = Timeframe.Month;
    const parsedMonth = computed(() => parseDateMMYYYY(selectedMonth.value));
    console.log('parsedMonth', parsedMonth.value);

    return useQuery<CarBudget>({
        queryKey: ['car-budget', parsedMonth.value, timeFrame],
        queryFn: () => fetchCarBudget(parsedMonth.value, timeFrame),
        refetchOnWindowFocus: false,
        enabled: !!selectedMonth.value,
    });
}
