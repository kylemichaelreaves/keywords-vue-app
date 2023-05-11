import { test } from 'vitest';
import {getMonthStartAndEnd} from "../../../api/helpers/getMonthStartAndEnd";

test('getMonthStartAndEnd: returns correct month start and end', async () => {
    const date = new Date(2023, 4, 5); // May 5, 2023
    const { monthStart, monthEnd } = getMonthStartAndEnd(date);

    // Assertions
    expect(monthStart).toBe('Monday May 1');
    expect(monthEnd).toBe('Wednesday May 31');
});

test('getMonthStartAndEnd: works with a leap year', async () => {
    const date = new Date(2024, 1, 15); // February 15, 2024 (leap year)
    const { monthStart, monthEnd } = getMonthStartAndEnd(date);

    // Assertions
    expect(monthStart).toBe('Thursday February 1');
    expect(monthEnd).toBe('Thursday February 29');
});


