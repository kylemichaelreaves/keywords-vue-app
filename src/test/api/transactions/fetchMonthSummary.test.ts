import {fetchMonthSummary} from '@api/transactions/fetchMonthSummary';
import {monthSummaryMock} from '@mocks/transaction';
import {server} from '@test/test-setup';
import {http, HttpResponse} from 'msw';
import {vi, test} from "vitest";

describe('fetchMonthSummary', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });


    test('fetchMonthSummary should return the correct data', async () => {
        const month = '11/2023'

        const result = await fetchMonthSummary(month)
        expect(result).toEqual(monthSummaryMock)
    })

    test('fetchMonthSummary should throw an error if the request fails', async () => {
        server.use(
            http.get('*/transactions/get-month-summary', (info) => {
            //     return res(ctx.status(500),
            //         ctx.json({data: 'Internal Server Error'}));
            // })
            return new HttpResponse('Unhandled request', {status: 500})
        }));

        const week = '13/2023';
        await expect(fetchMonthSummary(week)).rejects.toThrow();
    });

})