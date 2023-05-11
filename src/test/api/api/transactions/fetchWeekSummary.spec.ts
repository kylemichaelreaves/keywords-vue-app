import {fetchWeekSummary} from "../../../../api/transactions/fetchWeekSummary";
import {weekSummaryMock} from "../../../mock/transaction";
import {server} from "../../../test-setup";
import {rest} from "msw";


describe('fetchWeekSummary', () => {
    test('fetchWeekSummary should fetch data correctly', async () => {
        const week = '52-2021';

        const result = await fetchWeekSummary(week);
        expect(result).toEqual(weekSummaryMock);
    });

    test('fetchWeekSummary should throw an error if the request fails', async () => {
        server.use(
            rest.get('*/transactions/get-week-summary', (req, res, ctx) => {
                return res(ctx.status(500));
            })
        );

        const week = '53-2021';
        await expect(fetchWeekSummary(week)).rejects.toThrow();
    });
})
