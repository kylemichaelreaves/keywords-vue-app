import axios from "axios";
import type {Transaction} from "@types";
import {isValidURL} from "@api/helpers/isValidURL";

export const fetchTransaction = async (transactionNumber: string): Promise<Transaction> => {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // TODO replace with 'transactions/{transactionNumber}'
    return await axios.get(`${fetchURL}/transactions/get-transaction`, {
        params: {
            transactionNumber: transactionNumber
        },
    })
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
};