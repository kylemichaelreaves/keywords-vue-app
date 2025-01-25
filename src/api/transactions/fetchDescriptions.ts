import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

export async function fetchDescriptions(): Promise<Array<string>> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`/transactions/descriptions`)
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}