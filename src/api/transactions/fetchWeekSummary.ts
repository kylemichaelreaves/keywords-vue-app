import axios from 'axios'
import {isValidURL} from "@api/helpers/isValidURL";
import type {WeekSummary} from "@types";

export const fetchWeekSummary = async (
    week: string
): Promise<Array<WeekSummary>> => {

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid')
    }

    return await axios
        .get(`${fetchURL}/transactions/get-week-summary`,
            {
                params: {
                    week: week
                }
            })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err
        })


}
