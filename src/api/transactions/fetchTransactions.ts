import axios from "axios";
import {Transaction} from "../../types";
import {isValidURL} from "../helpers/isValidURL";
import {parseDateMMYYYY} from "../../dataUtils";
import {parseDateIWIYYY} from "../helpers/parseDateIWIYYY";

export const fetchTransactions = async (
    limit?: number,
    offset?: number,
    date?: string,
    memo?: string
): Promise<Array<Transaction>> => {

    if (date) {
        console.log('date passed to fetchTransactions:', date)
    } else if (!date) {
        console.log('date was not passed to fetchTransactions')
    }

    if (memo) {
        console.log('memo passed to fetchTransactions:', memo)
    } else if (!memo) {
        console.log('memo was not passed to fetchTransactions')
    }

    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // Check if the date string contains a dash or a slash and call the appropriate parser function
    const dateObj = date
        ? date.includes('-')
            ? parseDateIWIYYY(date)
            : date.includes('/')
                ? parseDateMMYYYY(date)
                : null
        : null;

    console.log('dateObj sent to Lambda:', dateObj)

    return await axios
        .get(`${fetchURL}/transactions/get-transactions`, {
            params: {
                limit,
                offset,
                date: dateObj ? dateObj.toISOString() : undefined,
                memo: memo ? memo : undefined
            },
        })
        .then((res) => res.data)
        .catch((err) => {
            console.log('err:', err);
            throw err;
        });
};
