import type {Memo} from "@types";
import {httpClient} from "@api/httpClient";

export async function updateMemo(memo: Partial<Memo>): Promise<Memo> {
    // TODO remove route from API Gateway. use '/memos/{memoId}' instead
    return await httpClient
        .patch(`/memos/update-memo`, {
            memo: memo
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}