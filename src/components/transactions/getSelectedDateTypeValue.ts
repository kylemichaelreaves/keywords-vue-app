// getSelectedDateValue.ts
import { computed } from "vue";
import { useTransactionsStore } from "@stores/transactions";
import {getDateType} from "@components/transactions/getDateType";

export const getSelectedDateTypeValue = () => {
    const store = useTransactionsStore();
    // This example assumes `getDateType` returns the current date type like 'month', 'day', etc.
    const dateType = getDateType();

    switch (dateType) {
        case 'day':
            return computed(() => store.getSelectedDay);
        case 'week':
            return computed(() => store.getSelectedWeek);
        case 'month':
            return computed(() => store.getSelectedMonth);
        // Add cases for 'year' and other timeframes as needed
        default:
            return computed(() => null); // Return a sensible default or handle error
    }
};
