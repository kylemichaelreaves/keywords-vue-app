import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

// TODO remove, since it's not being used
export async function fetchMemosCount(timeFrame?: string | undefined, date?: Date | null | undefined, distinct?: boolean | undefined): Promise<number> {
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
        .catch((err: Error) => {
            console.error('err:', err);
        });
}