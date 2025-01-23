import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Transaction} from "@types";

// should I be using Partial<Transaction> instead of Transaction?
export async function updateTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    // TODO remove route from API Gateway. use '/transactions/{transactionId}' instead
    return await axios.patch(`${fetchURL}/transactions/update-transaction`, {
        transaction: transaction
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}