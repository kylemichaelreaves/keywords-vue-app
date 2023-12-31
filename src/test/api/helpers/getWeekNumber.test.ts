import {getWeekNumber} from '@api/helpers/getWeekNumber';
import {expect} from 'chai';

describe('getWeekNumber', () => {
    it('should return the correct week number for a date in the middle of the year', () => {
        const date = new Date(2023, 5, 15); // June 15, 2023
        const weekNumber = getWeekNumber(date);
        expect(weekNumber).to.equal(24);
    });

    it('should return 1 for the first day of the year', () => {
        const date = new Date(2023, 0, 1); // January 1, 2023
        const weekNumber = getWeekNumber(date);
        expect(weekNumber).to.equal(1);
    });

    it('According to ISO 8601, it should return 53 for the last day of the year', () => {
        const date = new Date(2023, 11, 31); // December 31, 2023
        const weekNumber = getWeekNumber(date);
        expect(weekNumber).to.equal(53);
    });

    it('should handle leap years correctly', () => {
        const date = new Date(2024, 1, 29); // February 29, 2024
        const weekNumber = getWeekNumber(date);
        expect(weekNumber).to.equal(9);
    });
});