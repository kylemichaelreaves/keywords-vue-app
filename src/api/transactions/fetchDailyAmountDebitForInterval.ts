import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {DailyInterval} from "@types";

export const fetchDailyAmountDebitForInterval = async (
    interval: string
) => {

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios
        .get<Array<DailyInterval>>(`${fetchURL}/transactions/get-daily-total-amount-debit`, {
            params: {
                interval
            },
        })
        .then((res) => res.data)
        .catch((err) => {
            console.log('err:', err);
            throw err;
        });
};
