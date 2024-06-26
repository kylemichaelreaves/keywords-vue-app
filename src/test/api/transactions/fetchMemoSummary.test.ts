import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';
import {fetchMemoSummary} from "@api/transactions/fetchMemoSummary";
import type {MemoSummary} from "@types";
import {vi, test} from "vitest";

// Set up the MSW server
const server = setupServer();

const memoSummary: MemoSummary =
    {
        sum_amount_debit: 100,
        transactions_count: 1,
        // Add other properties as needed
    }
// Create a mock API handler
const mockAPIHandler = http.get('/transactions/get-memo-summary', (info) => {
    return new HttpResponse(JSON.stringify(memoSummary), {status: 200})
});

describe('fetchMemoSummary', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchMemoSummary returns memo summary data', async () => {
        server.use(mockAPIHandler);

        const memo = 'Memo: Test';
        const result = await fetchMemoSummary(memo);

        expect(result.sum_amount_debit).toBe(100);
        expect(result.transactions_count).toBe(1);
        // Add assertions for other properties as needed
    });

    test('fetchMemoSummary throws an error for an invalid URL', async () => {
        const originalEnvValue = import.meta.env.VITE_APIGATEWAY_URL;
        import.meta.env.VITE_APIGATEWAY_URL = 'not-a-valid-url';

        await expect(fetchMemoSummary('Memo: Test')).rejects.toThrowError('url is not valid');

        import.meta.env.VITE_APIGATEWAY_URL = originalEnvValue;
    });

    test('fetchMemoSummary handles API errors', async () => {
        const endpoint = `${import.meta.env.VITE_APIGATEWAY_URL}/transactions/get-memo-summary`;

        server.use(
            http.get(endpoint, (info) => {
                // return res(ctx.status(500), ctx.text('Internal Server Error'));
                return new HttpResponse('Unhandled request', {status: 500})
            })
        );

        try {
            expect(fetchMemoSummary('Memo: Test-X'))
        } catch (error) {
            expect(error).toBeDefined();
            expect((error as Error).message).toBe('Request failed with status code 500');
        }
    });
});
