import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {OFSummaryTypeBase} from "@types";

export async function fetchOFAmountDebit(timeFrame: string, date?: Date | null | undefined): Promise<OFSummaryTypeBase> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-of-amount-debit`, {
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