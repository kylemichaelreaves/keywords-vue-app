import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

export const fetchTimeframeSummary = async (timeFrame: string | undefined, date: Date | null | undefined) => {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    if (!date) {
        throw Error('No date was provided to fetchTimeframeSummary');
    }

    return await axios.get(`${fetchURL}/transactions/get-timeframe-summary`, {
        params: {
            timeFrame: timeFrame,
            date: date?.toISOString().split('T')[0]
        }
    })
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });
}
