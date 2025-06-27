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
        const month = '11-2023'

        const result = await fetchMonthSummary(month)
        expect(result).toEqual(monthSummaryMock)
    })

    test.skip('fetchMonthSummary should throw an error if the request fails', async () => {
        const week = '13-2023';
        await expect(fetchMonthSummary(week)).rejects.toThrow();
    });

})