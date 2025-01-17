import {useQuery} from '@tanstack/vue-query'
import type {Memo} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchMemo} from "@api/transactions/fetchMemo";

export default function useMemo(memoName: Memo['name']): UseQueryReturnType<Memo, Error> {
    return useQuery<Memo>({
        queryKey: ['memo', memoName],
        queryFn: () => fetchMemo(memoName),
        refetchOnWindowFocus: false,
        enabled: !!memoName
    })
}
