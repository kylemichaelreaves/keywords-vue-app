import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Transaction, Memo} from "@types";

export async function fetchMemoTransactions(memo: string): Promise<Transaction> {
    console.log('memo:', memo);
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-transactions`, {
        params: {
            limit: undefined,
            offset: undefined,
            date: undefined,
            timeFrame: undefined,
            memo: memo
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });

}