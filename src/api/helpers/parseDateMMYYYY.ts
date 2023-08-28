export function parseDateMMYYYY(input: string): Date | null {
    const regex = /^(\d{2})\/(\d{4})$/;
    const match = input.match(regex);

    if (!match) {
        return null;
    }

    const month = parseInt(match[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(match[2], 10);

    if (month < 0 || month > 11) {
        return null;
    }

    return new Date(year, month);
}