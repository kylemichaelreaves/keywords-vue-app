import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {TimeframeType, Transaction} from "@types";


export const fetchTransactions = async (queryParams: {
    date: Date;
    offset: number;
    limit: number;
    memo: string;
    timeFrame: TimeframeType
}): Promise<Array<Transaction>> => {
    const {date, limit, offset, timeFrame, memo} = queryParams;

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }


    return await axios
        .get<Array<Transaction>>(`${fetchURL}/transactions/get-transactions`, {
            params: {
                limit: limit ? limit : undefined,
                offset: offset ? offset : undefined,
                date: date ? date : undefined,
                timeFrame: timeFrame ? timeFrame : undefined,
                memo: memo ? memo : undefined
            },
        })
        .then((res) => res.data)
        .catch((err) => {
            console.log('err:', err);
            throw err;
        });
};
