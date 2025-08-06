import { httpClient } from '@api/httpClient'
import type { TimeframeType } from '@types'

export async function fetchBudgetCategories(flatten: boolean, timeFrame?: TimeframeType, date?: string) {
  try {
    const res = await httpClient.get(`/budget-categories`, {
      params: {
        flatten,
        timeFrame,
        date
      }
    })
    return res.data
  } catch (err) {
    console.error('Error fetching budget categories:', { flatten, timeFrame, date }, err)
    throw err // Re-throw so @tanstack/vue-query can handle the error state
  }
}