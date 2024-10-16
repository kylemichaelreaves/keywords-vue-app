// getDateType.ts
import { useTransactionsStore } from "@stores/transactions";
import { computed } from "vue";
import {Timeframe} from "@types";

export const getDateType = () => {
    const store = useTransactionsStore();
    const selectedMonth = computed(() => store.getSelectedMonth);
    const selectedDay = computed(() => store.getSelectedDay);
    const selectedWeek = computed(() => store.getSelectedWeek);
    // Extend this logic to include other timeframes like 'year' in the future
    if (selectedDay.value) {
        return Timeframe.Day;
    } else if (selectedWeek.value) {
        return Timeframe.Week;
    } else if (selectedMonth.value) {
        return Timeframe.Month;
    } else {
        // Default or error handling
        return "unknown"; // Handle this case appropriately
    }
};
