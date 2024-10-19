import {computed} from "vue";
import type {ComputedRef} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import type {TimeframeType} from "@types";

export const getDateTypeAndValue = (): {
    dateType: TimeframeType;
    selectedValue: ComputedRef<string> | null;
} => {
    const store = useTransactionsStore();

    // Define computed properties for selected values
    const selectedDay = computed(() => store.getSelectedDay);
    const selectedWeek = computed(() => store.getSelectedWeek);
    const selectedMonth = computed(() => store.getSelectedMonth);
    const selectedYear = computed(() => store.getSelectedYear);

    // Determine the date dateType and corresponding value
    if (selectedDay.value) {
        return {dateType: "day", selectedValue: selectedDay};
    } else if (selectedWeek.value) {
        return {dateType: "week", selectedValue: selectedWeek};
    } else if (selectedMonth.value) {
        return {dateType: "month", selectedValue: selectedMonth};
    } else {
        return {dateType: "year", selectedValue: selectedYear};
    }
};
