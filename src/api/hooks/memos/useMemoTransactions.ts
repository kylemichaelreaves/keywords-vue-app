import type { Memo, Transaction } from '@types'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import { fetchMemoTransactions } from '@api/memos/fetchMemoTransactions.ts'

export default function useMemoTransactions(
  memoId: Memo['id'],
): UseQueryReturnType<Transaction[], Error> {
  return useQuery({
    queryKey: ['memoTransactions', memoId],
    queryFn: () => fetchMemoTransactions(memoId),
    refetchOnWindowFocus: false,
    enabled: !!memoId,
  })
}
