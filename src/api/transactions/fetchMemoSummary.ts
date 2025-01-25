import type {Memo, MemoSummary} from "@types";
import {httpClient} from "@api/httpClient";

export async function fetchMemoSummary(memo: Memo['name']): Promise<MemoSummary> {
    // TODO refactor, remove redundant path: /get-memo-summary, use 'transactions/summary?memo=${memo}'
    return await httpClient.get(`/transactions/get-memo-summary`, {
        params: {
            memo
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}