import {fetchMonthSummary} from '@api/transactions/fetchMonthSummary';
import {monthSummaryMock} from '@mocks/transaction';
import {server} from '../../test-setup';
import {rest} from 'msw';

describe('fetchMonthSummary', () => {
    test('fetchMonthSummary should return the correct data', async () => {
        const month = '11/2023'

        const result = await fetchMonthSummary(month)
        expect(result).toEqual(monthSummaryMock)
    })

    test('fetchMonthSummary should throw an error if the request fails', async () => {
        server.use(
            rest.get('*/transactions/get-month-summary', (req, res, ctx) => {
                return res(ctx.status(500));
            })
        );

        const week = '13/2023';
        await expect(fetchMonthSummary(week)).rejects.toThrow();
    });

})