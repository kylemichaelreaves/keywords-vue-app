import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Memo, MemoSummary} from "@types";

export async function fetchMemoSummary(memo: Memo['name']): Promise<MemoSummary> {
    console.log('memo:', memo);
    console.log('typeof memo:', typeof memo);

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-memo-summary`, {
        params: {
            memo
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });

}