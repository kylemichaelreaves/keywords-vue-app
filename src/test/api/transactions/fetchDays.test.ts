import {fetchDays} from "@api/transactions/fetchDays";
import {vi, test} from 'vitest'
import {daysMock} from "@mocks/transaction";

describe('fetchDays', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test('fetchDays without date parameter returns all days', async () => {
        const days = await fetchDays();
        expect(days).toEqual(daysMock);
    });


})