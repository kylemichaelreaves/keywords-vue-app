// getDateType.ts
import { useTransactionsStore } from "@stores/transactions";
import { computed } from "vue";

export const getDateType = () => {
    const store = useTransactionsStore();
    const selectedMonth = computed(() => store.getSelectedMonth);
    const selectedDay = computed(() => store.getSelectedDay);
    const selectedWeek = computed(() => store.getSelectedWeek);
    // Extend this logic to include other timeframes like 'year' in the future
    if (selectedDay.value) {
        return "day";
    } else if (selectedWeek.value) {
        return "week";
    } else if (selectedMonth.value) {
        return "month";
    } else {
        // Default or error handling
        return "unknown"; // Handle this case appropriately
    }
};
