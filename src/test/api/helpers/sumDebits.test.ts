import type {Transaction} from "@types";
import {sumDebits} from "@api/helpers/sumDebits";

describe('sumDebits', () => {
    const testData: Transaction[] = [
        {transaction_number: '0001', date: '01/01/2022', memo: 'test', amount_debit: '10.00'},
        {transaction_number: '0002', date: '01/01/2022', memo: 'test', amount_debit: '20.00'},
        {transaction_number: '0003', date: '02/01/2022', memo: 'test', amount_debit: '30.00'},
        {transaction_number: '0004', date: '02/01/2022', memo: 'test', amount_debit: '40.00'},
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