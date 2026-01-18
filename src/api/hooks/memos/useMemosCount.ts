import { useQuery } from '@tanstack/vue-query'
import { useTransactionsStore } from '@stores/transactions.ts'
import { fetchMemosCount } from '@api/memos/fetchMemosCount.ts'

export default function useMemosCount() {
  const store = useTransactionsStore()
  return useQuery({
    queryKey: ['memos-count'],
    queryFn: async () => {
      const data = await fetchMemosCount()
      const count = data[0]?.count ?? 0
      store.setMemosCount(count)
      return data
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })
}
