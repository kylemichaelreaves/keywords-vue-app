import {useMutation} from '@tanstack/vue-query'
import {updateMemo} from "@api/transactions/updateMemo";
import type {Memo} from "@types";

export default function mutateMemo() {
    return useMutation({
        mutationKey: ['mutate-memo'],
        mutationFn: async ({memo}: { memo: Memo })  => {
            return updateMemo(memo)
        }
    });
}