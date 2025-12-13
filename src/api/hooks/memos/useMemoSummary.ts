import { useQuery } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { fetchMemoSummary } from '@api/memos/fetchMemoSummary.ts'
import type { Memo, MemoSummary } from '@types'

export default function useMemoSummary(memoId: Memo['id']): UseQueryReturnType<MemoSummary, Error> {
  return useQuery({
    queryKey: ['memoSummary', memoId],
    queryFn: () => fetchMemoSummary(memoId),
    refetchOnWindowFocus: false,
    enabled: !!memoId,
  })
}
