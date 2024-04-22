import {fetchWeekSummary} from "@api/transactions/fetchWeekSummary";
import {weekSummaryMock} from "@mocks/transaction";
import {server} from "@test/test-setup";
import {http, HttpResponse} from "msw";
import {describe, test, vi} from "vitest";


describe('fetchWeekSummary', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchWeekSummary should fetch data correctly', async () => {
        const week = '52-2021';

        const result = await fetchWeekSummary(week);
        expect(result).toEqual(weekSummaryMock);
    });

    test('fetchWeekSummary should throw an error if the request fails', async () => {
        server.use(
            http.get('*/transactions/get-week-summary', (info) => {
                // return res(ctx.status(500));
                return new HttpResponse('Unhandled request', {status: 500})
            })
        );

        const week = '53-2021';
        await expect(fetchWeekSummary(week)).rejects.toThrow();
    });
})
