import { httpClient } from '@api/httpClient'
import type { MonthYear } from '@types'

// TODO refactor url, pass months as params, maybe an all param
export async function fetchMonths(): Promise<Array<MonthYear>> {
  return await httpClient
    .get(`/transactions/months`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
      throw err
    })
}
