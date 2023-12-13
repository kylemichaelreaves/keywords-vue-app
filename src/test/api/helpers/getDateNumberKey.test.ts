import {getDateNumberKey} from "@api/helpers/getDateNumberKey";

describe('getDateNumberKey', () => {
    test('getDateNumberKey should return the correct data', () => {
        const result = getDateNumberKey('month')
        expect(result).toEqual('month_number')
    })

    test('getDateNumberKey should return the correct data', () => {
        const result = getDateNumberKey('week')
        expect(result).toEqual('week_number')
    })
})