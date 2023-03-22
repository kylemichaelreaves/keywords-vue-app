import { filterDataByMonth, sumDebits } from '../dataUtils'
import {Transaction} from '../types';

describe('filterDataByMonth', () => {
    const testData: Transaction[] = [
        { Date: '01/01/2022', Memo: 'test', 'Amount Debit': '10.00' },
        { Date: '02/01/2022', Memo: 'test', 'Amount Debit': '20.00' },
        { Date: '03/01/2022', Memo: 'test', 'Amount Debit': '30.00' },
    ];

    it('returns filtered data for a selected month', () => {
        const result = filterDataByMonth(testData, '01/2022');
        expect(result).toHaveLength(1);
        expect(result[0].Date).toBe('01/01/2022');
    });

    it('returns all data when no month is selected', () => {
        const result = filterDataByMonth(testData, '');
        expect(result).toHaveLength(3);
    });
});

describe('sumDebits', () => {
    const testData: Transaction[] = [
        { Date: '01/01/2022', Memo: 'test', 'Amount Debit': '10.00' },
        { Date: '01/01/2022', Memo: 'test', 'Amount Debit': '20.00' },
        { Date: '02/01/2022', Memo: 'test', 'Amount Debit': '30.00' },
        { Date: '02/01/2022', Memo: 'test', 'Amount Debit': '40.00' },
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
