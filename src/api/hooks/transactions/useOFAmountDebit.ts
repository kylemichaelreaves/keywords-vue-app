import type { UseQueryReturnType } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import { fetchOFAmountDebit } from '@api/transactions/fetchOFAmountDebit'
import { getDateTypeAndValue } from '@components/transactions/getDateTypeAndValue'
import { parseDateIWIYYY } from '@api/helpers/parseDateIWIYYY'
import { parseDateMMYYYY } from '@api/helpers/parseDateMMYYYY'
import type { OFSummary } from '@types'
import { computed } from 'vue'


export default function useOFAmountDebit(): UseQueryReturnType<OFSummary, Error> {
  const { dateType, selectedValue } = getDateTypeAndValue()
  const queryKey = computed(() => ['OFAmountDebit', dateType, selectedValue?.value])

  return useQuery<OFSummary>({
    queryKey: queryKey.value,
    queryFn: () => {
      // Determine the date object based on the date type
      let dateObj: Date | null = null
      if (dateType === 'week' && selectedValue) {
        dateObj = parseDateIWIYYY(selectedValue.value)
      } else if (dateType === 'month' && selectedValue) {
        dateObj = parseDateMMYYYY(selectedValue.value)
      }

      if (!dateObj) {
        throw new Error('Invalid date')
      }

      return fetchOFAmountDebit(dateType, dateObj)
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedValue
  })
}
