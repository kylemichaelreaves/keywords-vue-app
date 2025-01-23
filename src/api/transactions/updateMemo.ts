import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Memo} from "@types";

export async function updateMemo (memo: Partial<Memo>): Promise<Memo> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }
    // TODO remove route from API Gateway. use '/memos/{memoId}' instead
    return await axios.patch(`${fetchURL}/transactions/update-memo`, {
        memo: memo
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
            throw err;
        });
}