import { parseDateDDMMYYYY } from '@api/helpers/parseDateDDMMYYYY';

describe('parseDateDDMMYYYY', () => {
    it('returns a Date object for a valid date', () => {
        const input = '12/12/2022';
        const result = parseDateDDMMYYYY(input);
        expect(result).toEqual(new Date(2022, 11, 12));
    });

    it('returns null for an invalid date', () => {
        const input = 'abcd';
        const result = parseDateDDMMYYYY(input);
        expect(result).toBeNull();
    });

    it('returns null for a date with less than 10 characters', () => {
        const input = '12/12/22';
        const result = parseDateDDMMYYYY(input);
        expect(result).toBeNull();
    });

    it('returns null for a date with more than 10 characters', () => {
        const input = '12/12/20222';
        const result = parseDateDDMMYYYY(input);
        expect(result).toBeNull();
    });

    it('returns null for a date with invalid day', () => {
        const input = '32/12/2022';
        const result = parseDateDDMMYYYY(input);
        expect(result).toBeNull();
    });

    it('returns null for a date with invalid month', () => {
        const input = '12/13/2022';
        const result = parseDateDDMMYYYY(input);
        expect(result).toBeNull();
    });
});