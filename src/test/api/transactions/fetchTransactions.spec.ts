import {vi, test} from 'vitest';
import {fetchTransactions} from "@api/transactions/fetchTransactions";
import type {Transaction} from "@types";
import {transactionsMock} from "@mocks/transaction";

describe('fetchTransactions', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('should fetch transactions successfully', async ({expect}) => {
        const API_GATEWAY_URL = 'https://api.example.com';
        const limit = 10;
        const offset = 0;
        const transactions: Transaction[] = transactionsMock;

        const result = await fetchTransactions(limit);

        expect(result).toBeDefined();
        expect(result.length).toEqual(transactions.length);
    });

    test('should handle errors gracefully', async ({ expect }) => {
        const fetchUrl = 'https://api.example.com';
        const limit = 10;
        const offset = 0;

        try {
             await fetchTransactions(limit);
        } catch (error) {
            expect(error).toBeDefined()
            expect((error as Error).message).toBe('Request failed with status code 500');
        }
    });

    test('should throw an error if API_GATEWAY_URL is not defined', async ({expect}) => {
        const limit = 10;
        const offset = 0;

        try {
            await fetchTransactions(limit);
        } catch (error) {
            expect(error).toBeDefined();
            expect((error as Error).message).toBe('API_GATEWAY_URL is not defined');
        }
    });
});
