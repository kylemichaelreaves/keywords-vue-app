import axios from "axios";
import {isValidURL} from "@api/helpers/isValidUrl";
import type {Memo} from "@types";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";

export async function fetchMemos(date?: string): Promise<Array<Memo>> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // Convert the date string to a Date object
    const dateObj = date ? parseDateMMYYYY(date) : null;

    return await axios.get(`${fetchURL}/transactions/get-memos`, {
        params: {
            date: dateObj ? dateObj?.toISOString() : undefined
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });

}
