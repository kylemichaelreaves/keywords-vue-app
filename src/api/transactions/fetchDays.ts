import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {DayYear} from "@types";

export async function fetchDays(): Promise<Array<DayYear>> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-days`)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });
}