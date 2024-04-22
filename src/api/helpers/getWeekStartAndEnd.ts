import {DateTime} from 'luxon';

export function getWeekStartAndEnd(dateInput: Date) {
    // Parse the input date using Luxon
    const date = DateTime.fromJSDate(dateInput).startOf('day').setZone('UTC');

    // Calculate the start and end of the week
    const weekStart = date.startOf('week');
    const weekEnd = date.endOf('week');

    // Format start and end of the week
    const weekStartFormatted = weekStart.toFormat('cccc MMMM dd');
    const weekEndFormatted = weekEnd.toFormat('cccc MMMM dd');

    return {weekStart: weekStartFormatted, weekEnd: weekEndFormatted};
}


