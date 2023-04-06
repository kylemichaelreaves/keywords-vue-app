import axios from "axios";
import {isValidURL} from "../helpers/isValidURL";

export async function fetchAddress(id: string, fetchURL?: string) {
    if (!fetchURL) {
        if (!import.meta.env.VITE_APIGATEWAY_URL) {
            throw Error('VITE_APIGATEWAY_URL is not defined');
        } else {
            fetchURL = import.meta.env.VITE_APIGATEWAY_URL;
        }
    }

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/address-geocoder/${id}`)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw new Error(err);
        });
}