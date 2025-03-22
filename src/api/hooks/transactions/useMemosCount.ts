import { useQuery } from '@tanstack/vue-query'
import { useTransactionsStore } from '@stores/transactions'
import { fetchMemosCount } from '@api/transactions/fetchMemosCount'


export default function useMemosCount() {
  const store = useTransactionsStore()
  return useQuery({
    queryKey: ['memos-count'],
    queryFn: async () => {
      const count = await fetchMemosCount()
      store.setMemosCount(count)
      return count
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  })
}