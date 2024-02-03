import axios from "axios";
import type {Transaction} from "@types";
import {isValidURL} from "@api/helpers/isValidURL";
import type {FetchTransactionsParams} from "@types";

export const fetchTransactions = async (queryParams: FetchTransactionsParams): Promise<Array<Transaction>> => {
    const {date, limit, offset, timeFrame, memo} = queryParams;

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // Convert the date string to a Date object
    // TODO why is this null and not undefined?
    const dateObj = date ? date : undefined;

    return await axios
        .get(`${fetchURL}/transactions/get-transactions`, {
            params: {
                limit: limit ? limit : undefined,
                offset,
                date: dateObj ? dateObj.toISOString() : undefined,
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
