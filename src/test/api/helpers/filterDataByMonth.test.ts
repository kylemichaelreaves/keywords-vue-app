import type {Transaction} from "@types";
import {filterDataByMonth} from "@api/helpers/filterDataByMonth";

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