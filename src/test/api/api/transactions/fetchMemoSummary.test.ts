import {setupServer} from 'msw/node';
import {rest} from 'msw';
import {fetchMemoSummary} from "@/api/transactions/fetchMemoSummary";
import {MemoSummary} from "@/types";

// Set up the MSW server
const server = setupServer();

// Create a mock API handler
const mockAPIHandler = rest.get('/transactions/get-memo-summary', (req, res, ctx) => {

    const memoSummary: MemoSummary =
        {
            sum_amount_debit: 100,
            transactions_count: 1,
            // Add other properties as needed
        }
    ;

    return res(ctx.json(memoSummary));
});

describe('fetchMemoSummary', () => {
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
            rest.get(endpoint, (req, res, ctx) => {
                return res(ctx.status(500), ctx.text('Internal Server Error'));
            })
        );

        try {
            await expect(fetchMemoSummary('Memo: Test-X'))
        } catch (error) {
            expect(error).toBeDefined();
            expect((error as Error).message).toBe('Request failed with status code 500');
        }
    });
});
