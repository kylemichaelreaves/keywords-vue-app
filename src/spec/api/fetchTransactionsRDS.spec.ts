import {test} from 'vitest';
import {fetchTransactionsRDS} from "../../api/transactions/fetchTransactionsRDS";
import {Transaction, TransactionsList} from "../../types";
import {transactionsMock} from "../mock/transaction";
import {rest} from "msw";
import {server} from "../test-setup";

describe('fetchTransactionsRDS', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('should fetch transactions successfully', async ({expect}) => {
        const API_GATEWAY_URL = 'https://api.example.com';
        const limit = 10;
        const offset = 0;
        const transactions: TransactionsList['data'] = transactionsMock;

        // vi.mock('axios');

        const result = await fetchTransactionsRDS(limit, offset, API_GATEWAY_URL);

        expect(result).toBeDefined();
        expect(result.length).toEqual(transactions.length);
    });

    test('should handle errors gracefully and return an empty array', async ({ expect }) => {
        // Define the custom error handler
        const errorHandler = rest.get('*/transactions/get-transactions', (req, res, ctx) => {
            return res(ctx.status(500), ctx.json<Transaction[]>([]));
        });

        // Use the custom error handler for this test case
        server.use(errorHandler);

        const API_GATEWAY_URL = 'https://api.example.com';
        const limit = 10;
        const offset = 0;

        const result = await fetchTransactionsRDS(limit, offset, API_GATEWAY_URL);

        expect(result).toEqual([]);
    });

    test('should throw an error if API_GATEWAY_URL is not defined', async ({expect}) => {
        const limit = 10;
        const offset = 0;

        try {
            await fetchTransactionsRDS(limit, offset);
        } catch (error) {
            expect(error).toBeDefined();
            // TS18046: 'error' is of type 'unknown'.
            expect((error as Error).message).toBe('API_GATEWAY_URL is not defined');
        }
    });
});
