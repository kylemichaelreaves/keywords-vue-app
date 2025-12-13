// tests/mocks/useWeeks.mock.ts
import { ref } from 'vue'

export function useWeeksMock(weekData = []) {
  const data = ref(weekData)
  const isLoading = ref(false)
  const isFetching = ref(false)
  const isError = ref(false)
  const error = ref(null)

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  }
}
