import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

export async function fetchIsIntervalGreaterThanOldestDate(interval: string): Promise<boolean> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`/transactions/is-interval-greater-than-oldest-date`, {
        params: {
            interval
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}