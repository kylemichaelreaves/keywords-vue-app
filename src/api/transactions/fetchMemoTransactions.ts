import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Transaction, Memo} from "@types";

export async function fetchMemoTransactions(memoName: Memo['name']): Promise<Transaction> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-transactions`, {
        params: {
            memo: memoName
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
            throw err;
        });

}