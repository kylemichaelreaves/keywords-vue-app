import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

export async function fetchDaysOfWeek(weekString: string) {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-days-of-week`, {
        params: {
            week: weekString
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });
}