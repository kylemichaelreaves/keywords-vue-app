import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {TimeframeType, Memo} from "@types";

export async function fetchDescriptions(): Promise<Array<string>> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/descriptions`)
        .then((res) => res.data)
        .catch((err) => {
            console.error('err:', err);
        });
}