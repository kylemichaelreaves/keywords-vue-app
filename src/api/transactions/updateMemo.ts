import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Memo} from "@types";

export async function updateMemo (memo: Memo): Promise<Memo> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.patch(`${fetchURL}/transactions/update-memo`, {
        memo: memo
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });
}