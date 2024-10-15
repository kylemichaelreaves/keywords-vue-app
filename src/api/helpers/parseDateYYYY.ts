/**
 * Parses a date string in the format YYYY and returns a Date object.
 *
 * @param {string} input - The date string to parse.
 * @returns {Date | null} - A Date object if the input is valid, otherwise null.
 */
export function parseDateYYYY(input: string): Date | null {
    const regex = /^(\d{4})$/;
    const match = input.match(regex);

    if (!match) {
        return null;
    }

    const year = parseInt(match[1], 10);

    if (year < 0) {
        return null;
    }

    return new Date(year, 0, 1);
}