import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {DaySummary} from "@types";

export async function fetchDaySummary(day: string): Promise<DaySummary[]> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-day-summary`, {
        params: {
            day
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}