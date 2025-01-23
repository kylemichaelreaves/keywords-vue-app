import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

export default async function fetchOldestTransactionDate() {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // TODO instead of hitting this route, pass query params to transactions route
    return await axios
        .get<string>(`${fetchURL}/transactions/get-oldest-transaction-date`)
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}
