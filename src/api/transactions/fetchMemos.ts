import axios from "axios";
import {isValidURL} from "../helpers/isValidURL";
import {Memo} from "../../types";

export async function fetchMemos(): Promise<Array<Memo>> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-memos`)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });

}
