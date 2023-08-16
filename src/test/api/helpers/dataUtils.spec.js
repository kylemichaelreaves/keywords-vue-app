"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataUtils_1 = require("../../../api/helpers/dataUtils");
describe('filterDataByMonth', function () {
    var testData = [
        { transactionNumber: '0001', date: '01/01/2022', memo: 'test', amountDebit: '10.00' },
        { transactionNumber: '0002', date: '01/01/2022', memo: 'test', amountDebit: '20.00' },
        { transactionNumber: '0003', date: '02/01/2022', memo: 'test', amountDebit: '30.00' },
        { transactionNumber: '0004', date: '03/01/2022', memo: 'test', amountDebit: '40.00' },
    ];
    it('returns filtered data for a selected month', function () {
        var result = (0, dataUtils_1.filterDataByMonth)(testData, '01/2022');
        expect(result).toHaveLength(2);
        expect(result[0].date).toBe('01/01/2022');
    });
    it('returns all data when no month is selected', function () {
        var result = (0, dataUtils_1.filterDataByMonth)(testData, '');
        expect(result).toHaveLength(testData.length);
    });
});
describe('sumDebits', function () {
    var testData = [
        { transactionNumber: '0001', date: '01/01/2022', memo: 'test', amountDebit: '10.00' },
        { transactionNumber: '0002', date: '01/01/2022', memo: 'test', amountDebit: '20.00' },
        { transactionNumber: '0003', date: '02/01/2022', memo: 'test', amountDebit: '30.00' },
        { transactionNumber: '0004', date: '02/01/2022', memo: 'test', amountDebit: '40.00' },
    ];
    it('returns total debits grouped by month', function () {
        var result = (0, dataUtils_1.sumDebits)(testData, 'month');
        expect(result['01/2022']).toBe(30);
        expect(result['02/2022']).toBe(70);
    });
    it('returns total debits grouped by day', function () {
        var result = (0, dataUtils_1.sumDebits)(testData, 'day');
        expect(result['01/01/2022']).toBe(30);
        expect(result['02/01/2022']).toBe(70);
    });
    it('returns an empty object for empty input', function () {
        var result = (0, dataUtils_1.sumDebits)([], 'month');
        expect(result).toEqual({});
    });
});
describe('formatKey', function () {
    test('formats a snake_case key to capitalized words', function () {
        var input = 'snake_case_key';
        var expected = 'Snake Case Key';
        var result = (0, dataUtils_1.formatKey)(input);
        expect(result).toBe(expected);
    });
    test('formats a single word key without changing the capitalization', function () {
        var input = 'Key';
        var expected = 'Key';
        var result = (0, dataUtils_1.formatKey)(input);
        expect(result).toBe(expected);
    });
    test('formats a key with mixed capitalization', function () {
        var input = 'MiXeD_CaSe';
        var expected = 'Mixed Case';
        var result = (0, dataUtils_1.formatKey)(input);
        expect(result).toBe(expected);
    });
    test('returns an empty string for an empty input', function () {
        var input = '';
        var expected = '';
        var result = (0, dataUtils_1.formatKey)(input);
        expect(result).toBe(expected);
    });
});
describe('parseDateMMYYYY', function () {
    test('returns a Date object for valid input', function () {
        var input = '04/2023';
        var result = (0, dataUtils_1.parseDateMMYYYY)(input);
        expect(result).toBeInstanceOf(Date);
        expect(result === null || result === void 0 ? void 0 : result.getFullYear()).toBe(2023);
        expect(result === null || result === void 0 ? void 0 : result.getMonth()).toBe(3);
    });
    test('returns null for invalid input', function () {
        var input = 'invalid';
        var result = (0, dataUtils_1.parseDateMMYYYY)(input);
        expect(result).toBeNull();
    });
    test('returns null for invalid months', function () {
        var invalidMonths = ['00/2023', '13/2023'];
        invalidMonths.forEach(function (input) {
            var result = (0, dataUtils_1.parseDateMMYYYY)(input);
            expect(result).toBeNull();
        });
    });
});
describe('formatDate', function () {
    test('formats a valid date string', function () {
        var input = '2023-07-31T01:00:00.000Z';
        var expected = '2023-07-31';
        var result = (0, dataUtils_1.formatDate)(input);
        expect(result).toBe(expected);
    });
    test('handles different date inputs', function () {
        var inputs = [
            { input: '2021-12-25T18:30:00.000Z', expected: '2021-12-25' },
            { input: '2020-02-29T12:00:00.000Z', expected: '2020-02-29' },
            { input: '2010-07-04T04:45:00.000Z', expected: '2010-07-04' },
        ];
        inputs.forEach(function (_a) {
            var input = _a.input, expected = _a.expected;
            var result = (0, dataUtils_1.formatDate)(input);
            expect(result).toBe(expected);
        });
    });
    test('returns "Invalid date" for invalid date strings', function () {
        var invalidInputs = ['invalid', '2021-13-01', '2021-02-34'];
        invalidInputs.forEach(function (input) {
            var result = (0, dataUtils_1.formatDate)(input);
            expect(result).toBe('Invalid date');
        });
    });
});
