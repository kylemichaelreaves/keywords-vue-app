import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {MJSummary} from "@types";

export async function fetchMJAmountDebit(timeFrame: string, date?: Date | null | undefined): Promise<MJSummary> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-mj-amount-debit`, {
        params: {
            timeFrame: timeFrame,
            date: date ? date?.toISOString().split('T')[0] : null
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });

}