import axios from "axios";
import type {Transaction} from "@types";
import {isValidURL} from "@api/helpers/isValidURL";

export const fetchTransaction = async (transactionNumber: string): Promise<Transaction> => {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios
        .get(`${fetchURL}/transactions/get-transaction`, {
            params: {
                transactionNumber: transactionNumber
            },
        })
        .then((res) => res.data)
        .catch((err) => {
            console.log('err:', err);
            throw err;
        });
};