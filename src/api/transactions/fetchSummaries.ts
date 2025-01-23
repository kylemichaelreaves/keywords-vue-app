import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Summaries} from "@types";

export async function fetchSummaries(timeFrame: string) {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get<Array<Summaries>>(`${fetchURL}/transactions/get-summaries`, {
        params: {
            timeFrame
        },
    })
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}