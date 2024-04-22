import { DateTime } from "luxon";

export default function getIsoWeeksOfMonth(year: number, month: number): number[] {
    const weeks: number[] = [];

    if (year < 1) {
        return [];
    }

    let startOfWeek = DateTime.utc(year, month).startOf('month').startOf('week');

    const endOfMonth = DateTime.utc(year, month).endOf('month');

    while (startOfWeek <= endOfMonth) {
        weeks.push(startOfWeek.weekNumber);
        startOfWeek = startOfWeek.plus({ weeks: 1 });
    }

    return weeks;
}
