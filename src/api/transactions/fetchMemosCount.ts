import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

export async function fetchMemosCount(timeFrame?: string | undefined, date?: Date | null | undefined, distinct?: boolean | undefined) {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/memos/get-memos-count`, {
        params: {
            timeFrame: timeFrame,
            date: date,
            distinct: distinct
        }})
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw new Error(err);
        });
}