import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

export async function fetchWeeksOfMonth(monthString: string) {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-weeks-of-month`, {
        params: {
            month: monthString
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}