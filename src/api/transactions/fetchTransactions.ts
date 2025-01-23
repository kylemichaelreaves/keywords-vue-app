import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {TimeframeType, Memo} from "@types";


export async function fetchTransactions(queryParams: {
    date: Date;
    offset: number;
    limit: number;
    memo: Memo['name'];
    timeFrame: TimeframeType
}) {
    const {date, limit, offset, timeFrame, memo} = queryParams;

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // TODO refactor in V2 api, remove redundant path: /get-transactions
    return await axios.get(`${fetchURL}/transactions/get-transactions`, {
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
