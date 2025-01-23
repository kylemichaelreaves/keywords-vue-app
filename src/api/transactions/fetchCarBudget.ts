import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {CarBudget, TimeframeType} from "@types";

// returns a CarBudget for a given date, for a given timeFrame
export default async function fetchCarBudget(date: Date | null, timeFrame: TimeframeType): Promise<CarBudget> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // TODO instead of a path, pass query params to transactions route, budgetCategory
    return await axios.get(`${fetchURL}/transactions/get-car-budget`, {
        params: {
            timeFrame: timeFrame,
            date: date
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}