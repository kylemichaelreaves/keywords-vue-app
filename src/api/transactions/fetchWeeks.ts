import axios from "axios";
import {isValidURL} from "../helpers/isValidURL";
import {WeekYear} from "@/types";

export async function fetchWeeks(): Promise<Array<WeekYear>> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-weeks`)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });
}
