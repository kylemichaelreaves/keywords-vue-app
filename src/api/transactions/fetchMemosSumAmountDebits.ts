import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {MemoSumAmountDebits} from "@types";

export async function fetchMemosSumAmountDebits(limit: number, offset: number): Promise<MemoSumAmountDebits[]> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-memos-sum-amount-debits`, {
        params: {
            limit: limit,
            offset: offset,
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });

}