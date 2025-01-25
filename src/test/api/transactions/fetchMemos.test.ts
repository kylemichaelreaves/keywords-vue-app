import {vi, test} from 'vitest'
import {fetchMemos} from "@api/transactions/fetchMemos";
import {memosMock} from "@mocks/transaction";

describe('fetchMemos', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchMemos without date parameter returns all memos', async () => {
        const memos = await fetchMemos();
        expect(memos).toEqual(memosMock);
    });


})