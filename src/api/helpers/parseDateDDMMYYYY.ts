/**
 * Parses a date string in the format DD/MM/YYYY and returns a Date object.
 *
 * @param {string} input - The date string to parse.
 * @returns {Date | null} - A Date object if the input is valid, otherwise null.
 */
export function parseDateDDMMYYYY(input: string): Date | null {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = input.match(regex);

    if (!match) {
        return null;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
    const year = parseInt(match[3], 10);

    if (day < 1 || day > 31 || month < 0 || month > 11) {
        return null;
    }

    return new Date(year, month, day);
}