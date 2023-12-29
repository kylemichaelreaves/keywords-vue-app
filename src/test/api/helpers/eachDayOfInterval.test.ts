import {eachDayOfInterval} from "@api/helpers/eachDayOfInterval";

describe('eachDayOfInterval', () => {
    it('returns an array with a single date when start and end are the same', () => {
        const start = new Date(2022, 0, 1);
        const end = new Date(2022, 0, 1);
        expect(eachDayOfInterval(start, end)).toEqual([start]);
    });

    it('returns an array with two dates when start and end are consecutive days', () => {
        const start = new Date(2022, 0, 1);
        const end = new Date(2022, 0, 2);
        expect(eachDayOfInterval(start, end)).toEqual([start, end]);
    });

    it('returns an array with all dates in a month', () => {
        const start = new Date(2022, 0, 1);
        const end = new Date(2022, 0, 31);
        const result = eachDayOfInterval(start, end);
        expect(result.length).toBe(31);
        expect(result[0]).toEqual(start);
        expect(result[result.length - 1]).toEqual(end);
    });
});