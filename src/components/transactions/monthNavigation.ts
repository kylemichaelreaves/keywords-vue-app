import type {MonthYear} from "@types";

export const adjustSelectedMonth = (selectedMonth: string, months: MonthYear[], adjustment: number): string => {
    // Make sure selectedMonth is set and is present in months array
    if (selectedMonth && months.some(month => month.month_year === selectedMonth)) {
        const currentIndex = months.findIndex(month => month.month_year === selectedMonth);
        const newIndex = currentIndex + adjustment;
        // Ensure newIndex is within array bounds
        if (newIndex >= 0 && newIndex < months.length) {
            return months[newIndex].month_year;
        }
    }
    return selectedMonth;
};

export const goToPreviousMonth = (selectedMonth: string, months: MonthYear[]): string => {
    return adjustSelectedMonth(selectedMonth, months, 1);
};

export const goToNextMonth = (selectedMonth: string, months: MonthYear[]): string => {
    return adjustSelectedMonth(selectedMonth, months, -1);
};