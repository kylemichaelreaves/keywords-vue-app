import type { DayYear } from '@types'
import { httpClient } from '@api/httpClient'

// TODO refactor url, pass days as params, maybe an all param
export async function fetchDays(): Promise<Array<DayYear>> {
  return await httpClient
    .get(`/transactions/days`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}