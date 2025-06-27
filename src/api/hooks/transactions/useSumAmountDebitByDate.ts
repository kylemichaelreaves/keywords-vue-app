import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { fetchSumAmountDebitByDate } from '@api/transactions/fetchSumAmountDebitByDate'
import { parseDateIWIYYY } from '@api/helpers/parseDateIWIYYY'
import { parseDateMMYYYY } from '@api/helpers/parseDateMMYYYY'
import { parseDateDDMMYYYY } from '@api/helpers/parseDateDDMMYYYY'
import { parseDateYYYY } from '@api/helpers/parseDateYYYY'
import { useTransactionsStore } from '@stores/transactions'
import { computed } from 'vue'

export default function useSumAmountDebitByDate(timeFrame: string, date: string): UseQueryReturnType<{
  total_amount_debit: number
}, Error> {

  const store = useTransactionsStore()
  const selectedDay = computed(() => store.getSelectedDay)
  const selectedWeek = computed(() => store.getSelectedWeek)
  const selectedMonth = computed(() => store.getSelectedMonth)
  const selectedYear = computed(() => store.getSelectedYear)

  // eslint-disable-next-line vue/return-in-computed-property
  const dateType = computed(() => {
    if (selectedDay.value) return 'day'
    if (selectedWeek.value) return 'week'
    if (selectedMonth.value) return 'month'
    if (selectedYear.value) return 'year'
  })

  return useQuery<{ total_amount_debit: number }>({
    queryKey: ['sumAmountDebitByDate', timeFrame, date],
    queryFn: () => {
      let dateObj: Date | null | undefined
      if (dateType.value === 'day' && selectedDay.value) {
        dateObj = parseDateDDMMYYYY(selectedDay.value)
      } else if (dateType.value === 'week' && selectedWeek.value) {
        dateObj = parseDateIWIYYY(selectedWeek.value)
      } else if (dateType.value === 'month' && selectedMonth.value) {
        dateObj = parseDateMMYYYY(selectedMonth.value)
      } else if (dateType.value === 'year' && selectedYear.value) {
        dateObj = parseDateYYYY(selectedYear.value)
      }
      return fetchSumAmountDebitByDate(timeFrame, dateObj)
    },
    refetchOnWindowFocus: false
  })
}