import {DateTime} from 'luxon';

export function parseDateMMYYYY(input: string) {
    // regex to match the format MM/YYYY
    const regex = /^(\d{2})\/(\d{4})$/;
    const match = input.match(regex);

    if (!match) {
        return null;
    }

    const [month, year] = input.split('/').map(Number);
    const dt = DateTime.fromObject({year: year, month: month, day: 1}, {zone: 'UTC'});

    if (dt.isValid && month >= 1 && month <= 12) {
        return new Date(Date.UTC(year, month - 1, 1));
    }

    return null;
}