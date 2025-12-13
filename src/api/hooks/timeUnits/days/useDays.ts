import { useQuery } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { DayYear } from '@types'
import { fetchDays } from '@api/timeUnits/days/fetchDays.ts'
import { useTransactionsStore } from '@stores/transactions.ts'
import { computed } from 'vue'

export const useDays = (): UseQueryReturnType<DayYear[], Error> => {
  const store = useTransactionsStore()
  const cachedDays = computed(() => store.getDays)
  return useQuery<Array<DayYear>>({
    queryKey: ['days'],
    queryFn: async () => {
      if (cachedDays.value.length > 0) {
        return cachedDays.value
      } else {
        const days = fetchDays()
        store.setDays(await days)
        return days
      }
    },
    refetchOnWindowFocus: false,
  })
}
