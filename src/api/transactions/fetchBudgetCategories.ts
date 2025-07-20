import { httpClient } from '@api/httpClient'
import type { TimeframeType } from '@types'

export async function fetchBudgetCategories(flatten:boolean, timeFrame?: TimeframeType, date?: string) {
  return await httpClient
    .get(`/budget-categories`, {
      params: {
        flatten,
        timeFrame,
        date
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}