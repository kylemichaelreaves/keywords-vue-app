import axios from "axios";
import type {Transaction} from "@types";
import {isValidURL} from "@api/helpers/isValidURL";

export const fetchTransactions = async (
    limit?: number,
    offset?: number,
    memo?: string,
    timeFrame?: string,
    date?: Date | null | undefined,
): Promise<Array<Transaction>> => {

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // Convert the date string to a Date object
    const dateObj = date ? date : null;

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
