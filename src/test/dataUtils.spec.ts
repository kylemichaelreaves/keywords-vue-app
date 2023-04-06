import {filterDataByMonth, sumDebits} from '../dataUtils'
import {Transaction} from '../types';

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
