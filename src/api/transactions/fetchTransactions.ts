import {httpClient} from "@api/httpClient";
import type {TimeframeType, Memo} from "@types";

export async function fetchTransactions(queryParams: {
    date: Date;
    offset: number;
    limit: number;
    memo: Memo['name'];
    timeFrame: TimeframeType
}) {
    const {date, limit, offset, timeFrame, memo} = queryParams;

    // TODO refactor in V2 api, remove redundant path: /get-transactions
    return await httpClient.get(`/transactions/get-transactions`, {
        params: {
            date: date ? date : undefined,
            offset: offset ? offset : undefined,
            limit: limit ? limit : undefined,
            memo: memo ? memo : undefined,
            timeFrame: timeFrame ? timeFrame : undefined,
        },
    })
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
};
