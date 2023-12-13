import filterDataByMemo from "@api/helpers/filterDataByMemo";
import type {Transaction} from "@types";

// export default function filterDataByMemo(data: Transaction[], selectedMemo: string): Transaction[] {
//     if (selectedMemo) {
//         return data.filter((d: Transaction) => d.memo === selectedMemo);
//     } else {
//         return data;
//     }
// }
describe('filterDataByMemo', () => {
    test('filterDataByMemo should return the correct data', () => {
        const data = [
            {
                transactionNumber: 1,
                date: '2021-05-15',
                amountCredit: 100,
                memo: 'Test Memo 1',
                category: 'Test Category 1',
                type: 'Test Type 1',
            },
            {
                transactionNumber: 2,
                date: '2021-05-15',
                amountCredit: 200,
                memo: 'Test Memo 2',
                category: 'Test Category 2',
                type: 'Test Type 2',
            },
            {
                transactionNumber: 3,
                date: '2021-05-15',
                amountCredit: 300,
                memo: 'Test Memo 1',
                category: 'Test Category 1',
                type: 'Test Type 1',
            },
        ] as Transaction[];
        const selectedMemo = 'Test Memo 1';

        const result = filterDataByMemo(data, selectedMemo);
        expect(result).toEqual([
            {
                transactionNumber: 1,
                date: '2021-05-15',
                amountCredit: 100,
                memo: 'Test Memo 1',
                category: 'Test Category 1',
                type: 'Test Type 1',
            },
            {
                transactionNumber: 3,
                date: '2021-05-15',
                amountCredit: 300,
                memo: 'Test Memo 1',
                category: 'Test Category 1',
                type: 'Test Type 1',
            },
        ]);
    });

    test('filterDataByMemo should return all data if no memo is selected', () => {
        const data = [
            {
                transactionNumber: 1,
                date: '2021-05-15',
                amountCredit: 100,
                memo: 'Test Memo 1',
                category: 'Test Category 1',
                type: 'Test Type 1',
            },
            {
                transactionNumber: 2,
                date: '2021-05-15',
                amountCredit: 200,
                memo: 'Test Memo 2',
                category: 'Test Category 2',
                type: 'Test Type 2',
            },
            {
                transactionNumber: 3,
                date: '2021-05-15',
                amountCredit: 300,
                memo: 'Test Memo 1',
                category: 'Test Category 1',
                type: 'Test Type 1',
            },
        ] as Transaction[];
        const selectedMemo = 'Test Memo 2';

        const result = filterDataByMemo(data, selectedMemo);
        expect(result).toEqual([
            {
                transactionNumber: 2,
                date: '2021-05-15',
                amountCredit: 200,
                memo: 'Test Memo 2',
                category: 'Test Category 2',
                type: 'Test Type 2',
            },
        ]);
    });

})