import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Transaction} from "@types";

export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
        const postUrl = import.meta.env.VITE_APIGATEWAY_URL;

        if (!isValidURL(postUrl)) {
            throw Error('url is not valid');
        }

        return await axios
            .post(`${postUrl}/transactions/update-transaction`, transaction)
            .then((res) => res.data)
            .catch((err) => {
                console.log('err:', err);
                throw err;
            });
}