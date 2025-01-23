import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Memo} from "@types";

export async function fetchMemo(memo: Memo['name']): Promise<Memo> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-memo`, {
        params: {
            memo: memo
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}
