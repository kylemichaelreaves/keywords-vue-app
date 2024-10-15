import type {DayYear} from "@types";

export const adjustSelectedDay = (selectedDay: string, days: DayYear[], adjustment: number): string => {
    // Make sure selectedDay is set and is present in days array
    if (selectedDay && days.some(day => day.day === selectedDay)) {
        const currentIndex = days.findIndex(day => day.day === selectedDay);
        const newIndex = currentIndex + adjustment;
        // Ensure newIndex is within array bounds
        if (newIndex >= 0 && newIndex < days.length) {
            return days[newIndex].day;
        }
    }
    return selectedDay;
};

export const goToPreviousDay = (selectedDay: string, days: DayYear[]): string => {
    return adjustSelectedDay(selectedDay, days, 1);
};

export const goToNextDay = (selectedDay: string, days: DayYear[]): string => {
    return adjustSelectedDay(selectedDay, days, -1);
};