import type {Transaction} from "@types";
import {httpClient} from "@api/httpClient";

export const fetchTransaction = async (transactionNumber: Transaction['transaction_number']): Promise<Transaction> => {
    return await httpClient
        .get(`/transactions/get-transaction`, {
            params: {
                transactionNumber
            }
        })
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
            throw new Error("Failed to fetch transaction. Please try again later.");
        });
};