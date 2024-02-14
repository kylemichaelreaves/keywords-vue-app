import {parseDateYYYY} from "@api/helpers/parseDateYYYY";


describe('parseDateYYYY', () => {
    it('returns a Date object for a valid year', () => {
        const input = '2022';
        const result = parseDateYYYY(input);
        expect(result).toEqual(new Date(2022, 0, 1));
    });

    it('returns null for an invalid year', () => {
        const input = 'abcd';
        const result = parseDateYYYY(input);
        expect(result).toBeNull();
    });

    it('returns null for a year with less than 4 digits', () => {
        const input = '123';
        const result = parseDateYYYY(input);
        expect(result).toBeNull();
    });

    it('returns null for a year with more than 4 digits', () => {
        const input = '12345';
        const result = parseDateYYYY(input);
        expect(result).toBeNull();
    });

    it('returns null for a negative year', () => {
        const input = '-2022';
        const result = parseDateYYYY(input);
        expect(result).toBeNull();
    });
});