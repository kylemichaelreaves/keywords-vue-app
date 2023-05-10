import axios from 'axios'
import {isValidURL} from "../helpers/isValidURL";
import {WeekYear} from "../../types";

export async function fetchWeeks(): Promise<Array<WeekYear>> {
    const fetchUrl = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchUrl)) {
        throw Error('url is not valid')
    }

    return await axios
        .get(`${fetchUrl}/transactions/get-weeks`)
        .then((res) => res.data).catch((err) => {
            console.log('err:', err);
            throw err;
        })

}
