import { useQuery } from '@tanstack/vue-query'
import type { Memo } from '@types'
import { fetchMemo } from '@api/transactions/fetchMemo.ts'

export default function useMemoBudgetCategory(memoId: Memo['id']) {
  return useQuery({
    queryKey: ['memo-budget-category', memoId],
    queryFn: async () => {
      const res = fetchMemo(memoId)
      return res.then(memo => {
        if (!memo) {
          throw new Error('Memo not found')
        }
        return memo.budgetCategory
      })
    },
    refetchOnWindowFocus: false
  })
}