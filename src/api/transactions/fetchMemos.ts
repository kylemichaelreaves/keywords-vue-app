import type { Memo, MemoQueryParams } from '@types'
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import {httpClient} from "@api/httpClient";

// TODO: update to account for selectedYear, selectedWeek, selectedDay — add timeframe parameter


export async function fetchMemos(queryParams: MemoQueryParams): Promise<Array<Memo>> {

    const {date, limit, offset} = queryParams;

    const dateObj = date ? parseDateMMYYYY(date) : null;
    return await httpClient
        .get(`/transactions/get-memos`, {
            params: {
                date: dateObj ? dateObj?.toISOString() : undefined,
                limit: limit ? limit : 100,
                offset: offset ? offset : 0,
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}
