import {DateTime} from "luxon";

export function getIsoWeekNumber(date: Date): number {
    // Convert the JavaScript Date object to a Luxon DateTime object
    const dt = DateTime.fromJSDate(date);
    // Get the ISO week number
    return dt.weekNumber;
}
