import { useQuery } from '@tanstack/vue-query'
import { useTransactionsStore } from '@stores/transactions'
import { fetchMemosCount } from '@api/transactions/fetchMemosCount'


export default function useMemosCount() {
  const store = useTransactionsStore()
  return useQuery({
    queryKey: ['memos-count'],
    queryFn: async () => {
      const data = await fetchMemosCount()
      store.setMemosCount(data[0].count)
      return data
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  })
}