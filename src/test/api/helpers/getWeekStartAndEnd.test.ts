import { Settings } from 'luxon';
import {getWeekStartAndEnd} from "@api/helpers/getWeekStartAndEnd";

Settings.defaultZone = 'UTC';
test('getWeekStartAndEnd: works with a regular week', async () => {
    const date = new Date(Date.UTC(2023, 4, 10)); // May 10, 2023
    const { weekStart, weekEnd } = getWeekStartAndEnd(date);

    // Assertions adjusted for a Sunday start of the week
    expect(weekStart).toBe('Monday May 08');
    expect(weekEnd).toBe('Sunday May 14');
});

test('getWeekStartAndEnd: works with a week crossing months', async () => {
    const date = new Date(Date.UTC(2023, 4, 31)); // May 31, 2023
    const { weekStart, weekEnd } = getWeekStartAndEnd(date);

    // Assertions adjusted for a Sunday start of the week
    expect(weekStart).toBe('Monday May 29');
    expect(weekEnd).toBe('Sunday June 04');
});

test('getWeekStartAndEnd: works with a week in a leap year', async () => {
    const date = new Date(Date.UTC(2024, 1, 29)); // February 29, 2024 (leap year)
    const { weekStart, weekEnd } = getWeekStartAndEnd(date);

    // Assertions adjusted for a Sunday start of the week
    expect(weekStart).toBe('Monday February 26');
    expect(weekEnd).toBe('Sunday March 03');
});