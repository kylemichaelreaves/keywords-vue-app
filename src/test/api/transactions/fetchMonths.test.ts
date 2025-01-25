import {fetchMonths} from "@api/transactions/fetchMonths";
import {vi, test} from "vitest";
import {monthsMock} from "@mocks/transaction/"

describe('fetchMonths', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchMonths without date parameter returns all months', async () => {
        const months = await fetchMonths();
        expect(months).toEqual(monthsMock);
    });


})