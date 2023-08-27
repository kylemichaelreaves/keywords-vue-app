import {test} from 'vitest'
import {fetchMemos} from "@api/transactions/fetchMemos";
import {memosMock} from "../../../mocks/transaction";

describe('fetchMemos', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchMemos without date parameter returns all memos', async () => {
        const memos = await fetchMemos();
        expect(memos).toEqual(memosMock);
    });

    test('fetchMemos with an invalid URL should throw an error', async () => {
        const originalFetchURL = import.meta.env.VITE_APIGATEWAY_URL;
        import.meta.env.VITE_APIGATEWAY_URL = 'not_a_valid_url';

        await expect(fetchMemos()).rejects.toThrowError('url is not valid');

        import.meta.env.VITE_APIGATEWAY_URL = originalFetchURL;
    });

})