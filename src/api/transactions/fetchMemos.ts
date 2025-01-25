import type {Memo} from "@types";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import {httpClient} from "@api/httpClient";

// TODO: update to account for selectedYear, selectedWeek, selectedDay — add timeframe parameter
export async function fetchMemos(date?: string): Promise<Array<Memo>> {
    const dateObj = date ? parseDateMMYYYY(date) : null;
    return await httpClient.get(`/transactions/get-memos`, {
        params: {
            date: dateObj ? dateObj?.toISOString() : undefined
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}
