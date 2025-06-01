import type { WeekSummary } from '@types'
import { httpClient } from '@api/httpClient'

// TODO refactor to be RESTful, pass week as params
export async function fetchWeekSummary(week: string): Promise<Array<WeekSummary>> {
  return await httpClient
    .get(`/transactions/weeks/${week}/summary`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })


}
