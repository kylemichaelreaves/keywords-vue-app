import { getDayOfYear } from '@api/helpers/getDayOfYear';

describe('getDayOfYear', () => {
    it('returns 1 for the first day of the year', () => {
        const date = new Date(2022, 0, 1);
        expect(getDayOfYear(date)).toBe(1);
    });

    it('returns 365 for the last day of a non-leap year', () => {
        const date = new Date(2021, 11, 31);
        expect(getDayOfYear(date)).toBe(365);
    });

    it('returns 366 for the last day of a leap year', () => {
        const date = new Date(2020, 11, 31);
        expect(getDayOfYear(date)).toBe(366);
    });

    it('returns the correct day of the year for a date in the middle of the year', () => {
        const date = new Date(2022, 6, 2); // July 2, 2022
        expect(getDayOfYear(date)).toBe(183);
    });
});