// getDateType.ts
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import {Timeframe} from "@types";

export const getDateType = () => {
    const store = useTransactionsStore();
    const selectedMonth = computed(() => store.getSelectedMonth);
    const selectedDay = computed(() => store.getSelectedDay);
    const selectedWeek = computed(() => store.getSelectedWeek);


    if (selectedDay.value) {
        return Timeframe.Day;
    } else if (selectedWeek.value) {
        return Timeframe.Week;
    } else if (selectedMonth.value) {
        return Timeframe.Month;
    } else {
        return Timeframe.Year;
    }
};
