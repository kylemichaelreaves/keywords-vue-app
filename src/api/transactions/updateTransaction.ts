import {httpClient} from "@api/httpClient";
import type {Transaction} from "@types";

// TODO remove route from API Gateway. use '/transactions/{transactionId}' instead
export async function updateTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    return await httpClient
        .patch(`/transactions/update-transaction`, {
            transaction: transaction
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}