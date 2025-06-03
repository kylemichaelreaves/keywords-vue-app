import type { DayYear } from '@types'
import { httpClient } from '@api/httpClient'


export async function fetchDays(): Promise<Array<DayYear>> {
  return await httpClient
    .get(`/transactions/days`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}