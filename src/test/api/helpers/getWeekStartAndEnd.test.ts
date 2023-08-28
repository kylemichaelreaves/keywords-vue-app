import {getWeekStartAndEnd} from "@api/helpers/getWeekStartAndEnd";

test('getWeekStartAndEnd: works with a regular week', async () => {
    const date = new Date(2023, 4, 10); // May 10, 2023
    const { weekStart, weekEnd } = getWeekStartAndEnd(date);

    // Assertions
    expect(weekStart).toBe('Sunday May 7');
    expect(weekEnd).toBe('Saturday May 13');
});

test('getWeekStartAndEnd: works with a week crossing months', async () => {
    const date = new Date(2023, 4, 31); // May 31, 2023
    const { weekStart, weekEnd } = getWeekStartAndEnd(date);

    // Assertions
    expect(weekStart).toBe('Sunday May 28');
    expect(weekEnd).toBe('Saturday June 3');
});

test('getWeekStartAndEnd: works with a week in a leap year', async () => {
    const date = new Date(2024, 1, 29); // February 29, 2024 (leap year)
    const { weekStart, weekEnd } = getWeekStartAndEnd(date);

    // Assertions
    expect(weekStart).toBe('Sunday February 25');
    expect(weekEnd).toBe('Saturday March 2');
});
