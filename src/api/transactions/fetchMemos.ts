import axios from "axios";
import {isValidURL} from "../helpers/isValidURL";
import {Memo} from "../../types";
import {parseDateMMYYYY} from "../../dataUtils";

export async function fetchMemos(date?: string): Promise<Array<Memo>> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    if (date) {
        console.log('date passed to fetchMemos:', date)
    } else if (!date) {
        console.log('date was not passed to fetchMemos')
    }

    // Convert the date string to a Date object
    const dateObj = date ? parseDateMMYYYY(date) : null;

    console.log('dateObj:', dateObj)

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
