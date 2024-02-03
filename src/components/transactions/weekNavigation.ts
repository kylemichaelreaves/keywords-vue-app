import type {WeekYear} from "@types";

export const adjustSelectedWeek = (selectedWeek: string, weeks: WeekYear[], adjustment: number): string => {
    // Make sure selectedWeek is set and is present in weeks array
    if (selectedWeek && weeks.some(week => week.week_year === selectedWeek)) {
        const currentIndex = weeks.findIndex(week => week.week_year === selectedWeek);
        const newIndex = currentIndex + adjustment;
        // Ensure newIndex is within array bounds
        if (newIndex >= 0 && newIndex < weeks.length) {
            return weeks[newIndex].week_year;
        }
    }
    return selectedWeek;
};

export const goToPreviousWeek = (selectedWeek: string, weeks: WeekYear[]): string => {
    return adjustSelectedWeek(selectedWeek, weeks, 1);
};

export const goToNextWeek = (selectedWeek: string, weeks: WeekYear[]): string => {
    return adjustSelectedWeek(selectedWeek, weeks, -1);
};
