import { DateTime } from 'luxon';

/**
 * Parses a date string in the format WW-YYYY (ISO week number and year) and returns a Date object.
 *
 * @param {string} input - The date string to parse.
 * @returns {Date | null} - A Date object if the input is valid, otherwise null.
 */

// used by the DailyIntervalLineChart
export function parseDateIWIYYY(input: string): Date | null {
    // regex to match the format WW-YYYY
    const regex = /^(\d{2})-(\d{4})$/;
    const match = RegExp(regex).exec(input);

    if (!match) {
        return null;
    }

    const weekNumber = parseInt(match[1], 10);
    const weekYear = parseInt(match[2], 10);

    const dt = DateTime.fromObject({ weekYear, weekNumber }, { zone: 'UTC' });

    if (!dt.isValid) {
        console.error(dt.invalidReason);
        return null;
    }

    return dt.toJSDate();
}