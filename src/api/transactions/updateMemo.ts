import type {Memo} from "@types";
import {httpClient} from "@api/httpClient";

// TODO remove route from API Gateway. use '/memos/{memoId}' instead
export async function updateMemo(memo: Partial<Memo>): Promise<Memo> {
    return await httpClient
        .patch(`/memos/${memo['id']}`, {
            memo: memo
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}