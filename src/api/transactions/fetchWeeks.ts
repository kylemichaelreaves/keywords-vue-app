import type { WeekYear } from '@types'
import { httpClient } from '@api/httpClient'

// TODO refactor url, pass weeks as params, maybe an all param
export async function fetchWeeks(): Promise<Array<WeekYear>> {
  return await httpClient
    .get(`/transactions/weeks`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}
