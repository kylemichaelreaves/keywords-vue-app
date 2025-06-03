import type {Memo, MemoSummary} from "@types";
import {httpClient} from "@api/httpClient";


export async function fetchMemoSummary(memo: Memo['name']): Promise<MemoSummary> {
    return await httpClient
        .get(`/memos/${memo}/summary`)
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}