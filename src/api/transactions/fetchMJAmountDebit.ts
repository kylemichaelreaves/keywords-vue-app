import axios from "axios";
import {isValidURL} from "../helpers/isValidURL";
import {MJSummary} from "@/types";

export async function fetchMJAmountDebit(timeFrame: string, date: Date | null | undefined): Promise<MJSummary> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    if (!date) {
        throw Error('No date was provided to fetchMJAmountDebit');
    }

    return await axios.get(`${fetchURL}/transactions/get-mj-amount-debit`, {
        params: {
            timeFrame: timeFrame,
            date: date?.toISOString().split('T')[0]
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });

}