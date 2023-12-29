import {useQuery} from "@tanstack/vue-query";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import type {DayYear} from "@types";
import {fetchDays} from "@api/transactions/fetchDays";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import {eachDayOfInterval} from '@api/helpers/eachDayOfInterval';
import {getWeekStartAndEnd} from '@api/helpers/getWeekStartAndEnd';
import {getMonthStartAndEnd} from '@api/helpers/getMonthStartAndEnd';

export const useDays = (): UseQueryReturnType<DayYear[], Error> => {
    const transactionsStore = useTransactionsStore();
    const selectedMonth = computed(() => transactionsStore.selectedMonth);
    const selectedWeek = computed(() => transactionsStore.selectedWeek);

    const filterDays = (startDay: Date, endDay: Date, days: DayYear[]) => {
        const intervalDays = eachDayOfInterval(startDay, endDay);
        return days.filter(day => intervalDays.includes(new Date(day.day_year)));
    }

    return useQuery<Array<DayYear>>({
        queryKey: ['days'],
        queryFn: () => fetchDays().then(days => {
            if (selectedMonth.value && selectedWeek.value) {
                const [month, year] = selectedMonth.value.split('/');
                const [week, _] = selectedWeek.value.split('/');
                const {
                    monthStart: monthStart,
                    monthEnd: monthEnd
                } = getMonthStartAndEnd(new Date(Number(year), Number(month) - 1));
                const {
                    weekStart: weekStart,
                    weekEnd: weekEnd
                } = getWeekStartAndEnd(new Date(Number(year), Number(month) - 1, 1 + (parseInt(week) - 1) * 7));
                const startDay = weekStart >= monthStart ? weekStart : monthStart;
                const endDay = weekEnd <= monthEnd ? weekEnd : monthEnd;
                days = filterDays(new Date(startDay), new Date(endDay), days);
            } else if (selectedMonth.value) {
                const [month, year] = selectedMonth.value.split('/');
                const {
                    monthStart: startDay,
                    monthEnd: endDay
                } = getMonthStartAndEnd(new Date(Number(year), Number(month) - 1));
                days = filterDays(new Date(startDay), new Date(endDay), days);
            } else if (selectedWeek.value) {
                const [week, year] = selectedWeek.value.split('/');
                const {
                    weekStart: startDay,
                    weekEnd: endDay
                } = getWeekStartAndEnd(new Date(Number(year), 0, 1 + (parseInt(week) - 1) * 7));
                days = filterDays(new Date(startDay), new Date(endDay), days);
            }
            return days;
        }),
        refetchOnWindowFocus: false,
    })
}