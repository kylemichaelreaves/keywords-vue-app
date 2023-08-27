import axios from "axios";
import { isValidURL } from "@api/helpers/isValidUrl";

export async function fetchUniqueMemoCount() {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-unique-memo-count`)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw new Error(err);
        });
}