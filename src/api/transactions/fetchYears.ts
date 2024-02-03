import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Year} from "@types";

export async function fetchYears(): Promise<Array<Year>> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-years`)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });
}