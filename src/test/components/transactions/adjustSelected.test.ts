import {adjustSelected} from "@components/transactions/adjustSelected";
import type {DayYear, MonthYear, WeekYear} from "@types";

describe('adjustSelected function', () => {
    const dayYearMock: DayYear[] = [
        {day_year: '2022-01-01'},
        {day_year: '2022-01-02'},
        {day_year: '2022-01-03'},
    ];

    const monthYearMock: MonthYear[] = [
        {month_year: '2022-01'},
        {month_year: '2022-02'},
        {month_year: '2022-03'},
    ];

    const weekYearMock: WeekYear[] = [
        {week_year: '2022-W01'},
        {week_year: '2022-W02'},
        {week_year: '2022-W03'},
    ];

    it('should correctly adjust the selected day', () => {
        expect(adjustSelected('2022-01-01', dayYearMock, 1, 'day_year')).toBe('2022-01-02');
        expect(adjustSelected('2022-01-02', dayYearMock, -1, 'day_year')).toBe('2022-01-01');
    });

    it('should correctly adjust the selected month', () => {
        expect(adjustSelected('2022-01', monthYearMock, 1, 'month_year')).toBe('2022-02');
        expect(adjustSelected('2022-02', monthYearMock, -1, 'month_year')).toBe('2022-01');
    });

    it('should correctly adjust the selected week', () => {
        expect(adjustSelected('2022-W01', weekYearMock, 1, 'week_year')).toBe('2022-W02');
        expect(adjustSelected('2022-W02', weekYearMock, -1, 'week_year')).toBe('2022-W01');
    });

    it('should not adjust the selected item if it is the first or last in the array', () => {
        expect(adjustSelected('2022-01-01', dayYearMock, -1, 'day_year')).toBe('2022-01-01');
        expect(adjustSelected('2022-01-03', dayYearMock, 1, 'day_year')).toBe('2022-01-03');
    });
});