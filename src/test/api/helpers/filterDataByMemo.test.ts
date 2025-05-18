import type {Transaction} from "@types";
import filterDataByMemo from "@api/helpers/filterDataByMemo";


describe('filterDataByMemo', () => {
    test('filterDataByMemo should return the correct data', () => {
        const data: Transaction[] = [
            {
                transaction_number: '1',
                date: '2021-05-15',
                description: 'Test Description 1',
                memo: 'Test Memo 1',
                amount_debit: '100',
                amount_credit: '100',
            },
            {
                transaction_number: '2',
                date: '2021-05-15',
                description: 'Test Description 2',
                memo: 'Test Memo 2',
                amount_debit: '200',
            },
            {
                transaction_number: '3',
                date: '2021-05-15',
                description: 'Test Description 3',
                memo: 'Test Memo 1',
                amount_debit: '300',
            },
        ];
        const selectedMemo = 'Test Memo 1';
        const result = filterDataByMemo(data, selectedMemo);
        expect(result).toEqual([
            {
                transactionNumber: '1',
                date: '2021-05-15',
                description: 'Test Description 1',
                memo: 'Test Memo 1',
                amountDebit: '100',
                amountCredit: '100',
            },
            {
                transactionNumber: '3',
                date: '2021-05-15',
                description: 'Test Description 3',
                memo: 'Test Memo 1',
                amountDebit: '300',
            },
        ]);
    });

    test('filterDataByMemo should return all data if no memo is selected', () => {
        const data: Transaction[] = [
            {
                transaction_number: '1',
                date: '2021-05-15',
                description: 'Test Description 1',
                memo: 'Test Memo 1',
                amount_debit: '100',
                amount_credit: '100',
            },
            {
                transaction_number: '2',
                date: '2021-05-15',
                description: 'Test Description 2',
                memo: 'Test Memo 2',
                amount_debit: '200',
            },
            {
                transaction_number: '3',
                date: '2021-05-15',
                description: 'Test Description 3',
                memo: 'Test Memo 1',
                amount_debit: '300',
            },
        ];
        const selectedMemo = 'Test Memo 2';

        const result = filterDataByMemo(data, selectedMemo);
        expect(result).toEqual([
            {
                transactionNumber: '2',
                date: '2021-05-15',
                description: 'Test Description 2',
                memo: 'Test Memo 2',
                amountDebit: '200',
            },
        ]);
    });
});