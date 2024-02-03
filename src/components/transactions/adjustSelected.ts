import type {DayYear, MonthYear, WeekYear} from "@types";

type NavigationType = DayYear | MonthYear | WeekYear;

export const adjustSelected = <T extends NavigationType & Record<keyof T, string>>(selected: string, items: T[], adjustment: number, key: keyof T): string => {
    // Make sure selected is set and is present in items array
    if (selected && items.some(item => item[key] === selected)) {
        const currentIndex = items.findIndex(item => item[key] === selected);
        const newIndex = currentIndex + adjustment;
        // Ensure newIndex is within array bounds
        if (newIndex >= 0 && newIndex < items.length) {
            return items[newIndex][key];
        }
    }
    return selected;
};

export const goToPrevious = <T extends NavigationType & Record<keyof T, string>>(selected: string, items: T[], key: keyof T): string => {
    return adjustSelected(selected, items, -1, key);
};

export const goToNext = <T extends NavigationType & Record<keyof T, string>>(selected: string, items: T[], key: keyof T): string => {
    return adjustSelected(selected, items, 1, key);
};