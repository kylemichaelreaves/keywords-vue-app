import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

export default async function fetchOldestTransactionDate(): Promise<string> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios
        .get<string>(`${fetchURL}/transactions/get-oldest-transaction-date`)
        .then((res) => res.data)
        .catch((err) => {
            console.log('err:', err);
            throw err;
        });
}
