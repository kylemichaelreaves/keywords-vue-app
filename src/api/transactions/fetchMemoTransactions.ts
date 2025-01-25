import type {Transaction, Memo} from "@types";
import {httpClient} from "@api/httpClient";

export async function fetchMemoTransactions(memoName: Memo['name']): Promise<Transaction> {
    return await httpClient.get(`/transactions/get-transactions`, {
        params: {
            memo: memoName
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
            throw err;
        });

}