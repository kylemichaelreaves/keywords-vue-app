import axios from "axios";
import { isValidURL } from "@api/helpers/isValidUrl";

export async function fetchSumAmountDebitByDate(timeFrame: string, date: Date | null | undefined) {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-sum-amount-debit-by-date`, {
        params: {
            timeFrame,
            date: date?.toISOString().split('T')[0]
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw new Error(err);
        });

}