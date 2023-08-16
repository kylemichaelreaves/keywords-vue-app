import {filterDataByMonth, sumDebits, parseDateMMYYYY, formatDate, formatKey} from '../../../api/helpers/dataUtils'
import {Transaction} from '@types/types';

describe('filterDataByMonth', () => {
    const testData: Transaction[] = [
        {transactionNumber: '0001', date: '01/01/2022', memo: 'test', amountDebit: '10.00'},
        {transactionNumber: '0002', date: '01/01/2022', memo: 'test', amountDebit: '20.00'},
        {transactionNumber: '0003', date: '02/01/2022', memo: 'test', amountDebit: '30.00'},
        {transactionNumber: '0004', date: '03/01/2022', memo: 'test', amountDebit: '40.00'},
    ];

    it('returns filtered data for a selected month', () => {
        const result = filterDataByMonth(testData, '01/2022');
        expect(result).toHaveLength(2);
        expect(result[0].date).toBe('01/01/2022');
    });

    it('returns all data when no month is selected', () => {
        const result = filterDataByMonth(testData, '');
        expect(result).toHaveLength(testData.length);
    });
});

describe('sumDebits', () => {
    const testData: Transaction[] = [
        {transactionNumber: '0001', date: '01/01/2022', memo: 'test', amountDebit: '10.00'},
        {transactionNumber: '0002', date: '01/01/2022', memo: 'test', amountDebit: '20.00'},
        {transactionNumber: '0003', date: '02/01/2022', memo: 'test', amountDebit: '30.00'},
        {transactionNumber: '0004', date: '02/01/2022', memo: 'test', amountDebit: '40.00'},
    ];

    it('returns total debits grouped by month', () => {
        const result = sumDebits(testData, 'month');
        expect(result['01/2022']).toBe(30);
        expect(result['02/2022']).toBe(70);
    });

    it('returns total debits grouped by day', () => {
        const result = sumDebits(testData, 'day');
        expect(result['01/01/2022']).toBe(30);
        expect(result['02/01/2022']).toBe(70);
    });

    it('returns an empty object for empty input', () => {
        const result = sumDebits([], 'month');
        expect(result).toEqual({});
    });
});


describe('formatKey', () => {
    test('formats a snake_case key to capitalized words', () => {
        const input = 'snake_case_key';
        const expected = 'Snake Case Key';
        const result = formatKey(input);

        expect(result).toBe(expected);
    });

    test('formats a single word key without changing the capitalization', () => {
        const input = 'Key';
        const expected = 'Key';
        const result = formatKey(input);

        expect(result).toBe(expected);
    });

    test('formats a key with mixed capitalization', () => {
        const input = 'MiXeD_CaSe';
        const expected = 'Mixed Case';
        const result = formatKey(input);

        expect(result).toBe(expected);
    });

    test('returns an empty string for an empty input', () => {
        const input = '';
        const expected = '';
        const result = formatKey(input);

        expect(result).toBe(expected);
    });
});

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

describe('formatDate', () => {
    test('formats a valid date string', () => {
        const input = '2023-07-31T01:00:00.000Z';
        const expected = '2023-07-31';
        const result = formatDate(input);
        expect(result).toBe(expected);
    });

    test('handles different date inputs', () => {
        const inputs = [
            { input: '2021-12-25T18:30:00.000Z', expected: '2021-12-25' },
            { input: '2020-02-29T12:00:00.000Z', expected: '2020-02-29' },
            { input: '2010-07-04T04:45:00.000Z', expected: '2010-07-04' },
        ];

        inputs.forEach(({ input, expected }) => {
            const result = formatDate(input);
            expect(result).toBe(expected);
        });
    });

    test('returns "Invalid date" for invalid date strings', () => {
        const invalidInputs = ['invalid', '2021-13-01', '2021-02-34'];

        invalidInputs.forEach((input) => {
            const result = formatDate(input);
            expect(result).toBe('Invalid date');
        });
    });
});