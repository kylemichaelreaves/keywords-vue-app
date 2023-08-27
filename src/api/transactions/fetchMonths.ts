import axios from "axios";
import {isValidURL} from "@api/helpers/isValidUrl";
import type {MonthYear} from "@types";

export async function fetchMonths(): Promise<Array<MonthYear>> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-months`)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });
}
