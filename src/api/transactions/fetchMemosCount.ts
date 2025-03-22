// TODO remove, since it's not being used
import {httpClient} from "@api/httpClient";

export async function fetchMemosCount(timeFrame?: string, date?: Date, distinct?: boolean): Promise<number> {
    return await httpClient
        .get(`/transactions/get-memos-count`, {
            params: {
                timeFrame: timeFrame,
                date: date,
                distinct: distinct
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}