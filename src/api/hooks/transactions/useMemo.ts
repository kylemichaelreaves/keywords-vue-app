import {useQuery} from '@tanstack/vue-query'
import type {Memo} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchMemo} from "@api/transactions/fetchMemo";

export default function useMemo(memoName: string): UseQueryReturnType<Memo, Error> {
    console.log('memoName', memoName)
    return useQuery<Memo>({
        queryKey: ['memo', memoName],
        queryFn: () => fetchMemo(memoName),
        refetchOnWindowFocus: false,
        enabled: !!memoName
    })
}
