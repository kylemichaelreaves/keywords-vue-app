import {DateTime} from 'luxon';

export function parseDateIWIYYY(input: string) {
    const regex = /^(\d{2})-(\d{4})$/;
    const match = input.match(regex);

    if (!match) {
        return null;
    }

    const weekNumber = parseInt(match[1], 10);
    const weekYear = parseInt(match[2], 10);

    const dt = DateTime.fromObject({weekYear, weekNumber}, {zone: 'UTC'});

    if (!dt.isValid) {
        console.error(dt.invalidReason);
        return null;
    }

    return dt.toJSDate();
}
