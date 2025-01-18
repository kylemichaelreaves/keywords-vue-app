import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchMemoSummary} from "@api/transactions/fetchMemoSummary";
import type {Memo, MemoSummary} from "@types";

export default function useMemoSummary(memoName: Memo['name']): UseQueryReturnType<MemoSummary, Error> {
    return useQuery({
        queryKey: ['memoSummary', memoName],
        queryFn: () => fetchMemoSummary(memoName),
        refetchOnWindowFocus: false,
        enabled: !!memoName
    })
}