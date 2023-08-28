import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";

describe('parseDateMMYYYY', () => {
    test('returns a Date object for valid input', () => {
        const input = '04/2023';
        const result = parseDateMMYYYY(input);
        expect(result).toBeInstanceOf(Date);
        expect(result?.getFullYear()).toBe(2023);
        expect(result?.getMonth()).toBe(3);
    });

    test('returns null for invalid input', () => {
        const input = 'invalid';
        const result = parseDateMMYYYY(input);
        expect(result).toBeNull();
    });

    test('returns null for invalid months', () => {
        const invalidMonths = ['00/2023', '13/2023'];

        invalidMonths.forEach((input) => {
            const result = parseDateMMYYYY(input);
            expect(result).toBeNull();
        });
    });

});