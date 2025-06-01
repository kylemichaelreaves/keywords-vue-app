import type { DaySummary } from '@types'
import { httpClient } from '@api/httpClient'

export async function fetchDaySummary(day: string): Promise<DaySummary[]> {
  const dayWithoutTime = day.split('T')[0]
  return await httpClient
    .get(`/transactions/days/${dayWithoutTime}/summary`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}