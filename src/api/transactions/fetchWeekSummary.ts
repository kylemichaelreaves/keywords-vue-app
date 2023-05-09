import axios from 'axios'
import {isValidURL} from "../helpers/isValidURL";
import {WeekSummary} from "../../types";
import {parseDateIWIYYY} from "../helpers/parseDateIWIYYY";

export const fetchWeekSummary = async (
    week: string
): Promise<Array<WeekSummary>> => {

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid')
    }

    const weekObj = parseDateIWIYYY(week)?.toISOString()
    console.log('weekObj sent to Lambda:', weekObj)

    return await axios
        .get(`${fetchURL}/transactions/get-week-summary`,
            {
                params: {
                    date: weekObj
                }
            })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err
        })


}
