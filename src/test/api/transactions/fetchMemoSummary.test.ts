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



});
