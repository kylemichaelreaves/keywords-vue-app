import {fetchWeeks} from "@api/transactions/fetchWeeks";
import {vi, test} from "vitest";
import {weeksMock} from "@mocks/transaction/"

describe('fetchWeeks', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchWeeks without date parameter returns all weeks', async () => {
        const weeks = await fetchWeeks();
        expect(weeks).toEqual(weeksMock);
    });

    test('fetchWeeks with an invalid URL should throw an error', async () => {
        const originalFetchURL = import.meta.env.VITE_APIGATEWAY_URL;
        import.meta.env.VITE_APIGATEWAY_URL = 'not_a_valid_url';

        await expect(fetchWeeks()).rejects.toThrowError('url is not valid');

        import.meta.env.VITE_APIGATEWAY_URL = originalFetchURL;
    });

})




