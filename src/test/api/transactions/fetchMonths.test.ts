import {fetchMonths} from "@api/transactions/fetchMonths";
import {test} from "vitest";
import {monthsMock} from "@mocks/transaction/"

describe('fetchMonths', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchMonths without date parameter returns all months', async () => {
        const months = await fetchMonths();
        expect(months).toEqual(monthsMock);
    });

    test('fetchMonths with an invalid URL should throw an error', async () => {
        const originalFetchURL = import.meta.env.VITE_APIGATEWAY_URL;
        import.meta.env.VITE_APIGATEWAY_URL = 'not_a_valid_url';

        await expect(fetchMonths()).rejects.toThrowError('url is not valid');

        import.meta.env.VITE_APIGATEWAY_URL = originalFetchURL;
    });

})