import axios from "axios";
import { isValidURL } from "@api/helpers/isValidURL";

export async function fetchTransactionsCount(timeFrame?: string | undefined, date?: Date | null | undefined | string) {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // TODO timeFrame should be optional — if there's no timeframe, it returns the total number of transactions
    // TODO refactor away from this route to passing query params to transactions route, totalTransactionsCount
    return await axios.get(`${fetchURL}/transactions/get-transactions-count`, {
        params: {
            timeFrame: timeFrame,
            date: date
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}