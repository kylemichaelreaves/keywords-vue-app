import {test} from 'vitest'
import {getIsoWeekNumber} from "@api/helpers/getIsoWeekNumber";

describe('getIsoWeekNumber', () => {

    test('returns correct ISO week number for a date in the middle of the year', () => {
        const date = new Date(2022, 5, 15) // June 15, 2022
        const result = getIsoWeekNumber(date)
        expect(result).toBe(24)
    })

    test('returns correct ISO week number for a date at the start of the year', () => {
        const date = new Date(2023, 0, 1) // January 1, 2023
        const result = getIsoWeekNumber(date)
        expect(result).toBe(52) // Week 52 of the previous year
    })

    test('returns correct ISO week number for a date at the end of the year', () => {
        const date = new Date(2022, 11, 31) // December 31, 2022
        const result = getIsoWeekNumber(date)
        expect(result).toBe(52)
    })

    test('returns correct ISO week number for a date in a leap year', () => {
        const date = new Date(2024, 1, 29) // February 29, 2024
        const result = getIsoWeekNumber(date)
        expect(result).toBe(9)
    })
});