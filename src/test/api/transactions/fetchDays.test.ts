import {fetchDays} from "@api/transactions/fetchDays";
import {test} from 'vitest'
import {daysMock} from "@mocks/transaction";

describe('fetchDays', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchDays without date parameter returns all days', async () => {
        const days = await fetchDays();
        expect(days).toEqual(daysMock);
    });

    test('fetchDays with an invalid URL should throw an error', async () => {
        const originalFetchURL = import.meta.env.VITE_APIGATEWAY_URL;
        import.meta.env.VITE_APIGATEWAY_URL = 'not_a_valid_url';

        await expect(fetchDays()).rejects.toThrowError('url is not valid');

        import.meta.env.VITE_APIGATEWAY_URL = originalFetchURL;
    });

})