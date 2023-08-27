import axios from "axios";
import {isValidURL} from "@api/helpers/isValidUrl";
import type {Summaries} from "@types";

export async function fetchSummaries(
    timeFrame: string
): Promise<Array<Summaries>> {

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios
        .get<Array<Summaries>>(`${fetchURL}/transactions/get-summaries`, {
            params: {
                timeFrame
            },
        })
        .then((res) => res.data)
        .catch((err) => {
            console.log('err:', err);
            throw err;
        });
}