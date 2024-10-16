import {computed} from "vue";
import type {ComputedRef} from "vue";
import { useTransactionsStore } from "@stores/transactions";

export const getDateTypeAndValue = (): {
    dateType: "day" | "week" | "month" | "unknown";
    selectedValue: ComputedRef<string> | null;
} => {
    const store = useTransactionsStore();

    // Define computed properties for selected values
    const selectedDay = computed(() => store.getSelectedDay);
    const selectedWeek = computed(() => store.getSelectedWeek);
    const selectedMonth = computed(() => store.getSelectedMonth);

    // Determine the date dateType and corresponding value
    if (selectedDay.value) {
        return { dateType: "day", selectedValue: selectedDay };
    } else if (selectedWeek.value) {
        return { dateType: "week", selectedValue: selectedWeek };
    } else if (selectedMonth.value) {
        return { dateType: "month", selectedValue: selectedMonth };
    } else {
        return { dateType: "unknown", selectedValue: null };
    }
};
