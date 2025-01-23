import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {DailyInterval} from "@types";

export async function fetchDailyAmountDebitForInterval(interval?: string, startDate?: string) {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios
        .get<Array<DailyInterval>>(`${fetchURL}/transactions/get-daily-total-amount-debit`, {
            params: {
                interval,
                startDate
            },
        })
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}
