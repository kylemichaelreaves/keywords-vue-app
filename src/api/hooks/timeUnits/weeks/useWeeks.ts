import { useQuery } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { fetchWeeks } from '@api/timeUnits/weeks/fetchWeeks.ts'
import type { WeekYear } from '@types'
import { useTransactionsStore } from '@stores/transactions.ts'
import { computed } from 'vue'

export const useWeeks = (): UseQueryReturnType<WeekYear[], Error> => {
  const store = useTransactionsStore()
  const cachedWeeks = computed(() => store.getWeeks)
  return useQuery<Array<WeekYear>>({
    queryKey: ['weeks'],
    queryFn: async () => {
      if (cachedWeeks.value.length > 0) {
        return cachedWeeks.value
      } else {
        const weeks = fetchWeeks()
        store.setWeeks(await weeks)
        return weeks
      }
    },
    refetchOnWindowFocus: false,
  })
}
