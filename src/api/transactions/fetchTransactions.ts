import axios from "axios";
import {Transaction} from "../../types";
import {isValidURL} from "../helpers/isValidURL";
import {parseDateMMYYYY} from "../../dataUtils";

export const fetchTransactions = async (
    limit?: number,
    offset?: number,
    date?: string
): Promise<Array<Transaction>> => {

    if (date) {
        console.log('date passed to fetchTransactions:', date)
    } else if (!date) {
        console.log('date was not passed to fetchTransactions')
    }

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // Convert the date string to a Date object
    const dateObj = date ? parseDateMMYYYY(date) : null;

    console.log('dateObj:', dateObj)

    return await axios
        .get(`${fetchURL}/transactions/get-transactions`, {
            params: {
                limit,
                offset,
                date: dateObj ? dateObj.toISOString() : undefined
            },
        })
        .then((res) => res.data)
        .catch((err) => {
            console.log('err:', err);
            throw err;
        });
};