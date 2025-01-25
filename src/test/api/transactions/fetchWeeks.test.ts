import {fetchWeeks} from "@api/transactions/fetchWeeks";
import {vi, test} from "vitest";
import {weeksMock} from "@mocks/transaction/"

describe('fetchWeeks', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchWeeks without date parameter returns all weeks', async () => {
        const weeks = await fetchWeeks();
        expect(weeks).toEqual(weeksMock);
    });

})




