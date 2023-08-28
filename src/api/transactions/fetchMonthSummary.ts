import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {MonthSummary} from "@types";

export async function fetchMonthSummary(month: string): Promise<MonthSummary[]> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-month-summary`, {
        params: {
            month
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });

}