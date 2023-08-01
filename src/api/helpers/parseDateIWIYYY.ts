export function parseDateIWIYYY(input: string): Date | null {
    const regex = /^(\d{2})-(\d{4})$/;
    const match = input.match(regex);

    if (!match) {
        return null;
    }

    const week = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);

    if (week < 1 || week > 53) {
        return null;
    }

    const firstDayOfYear = new Date(year, 0, 1);
    let firstWeekDay = firstDayOfYear.getUTCDay();
    firstWeekDay = firstWeekDay === 0 ? 7 : firstWeekDay; // Get the day of the week (1-7), treating Sunday as 7

    // If January 1st is not a Monday (2-7), then it belongs to the last week of the previous year
    if (firstWeekDay > 1) {
        firstWeekDay -= 7;
    }

    const daysOffset = (week - 1) * 7 + 1 - firstWeekDay;

    return new Date(year, 0, daysOffset);
}
