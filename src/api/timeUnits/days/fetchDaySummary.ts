import type { DaySummary } from '@types'
import { httpClient } from '@api/httpClient.ts'

export async function fetchDaySummary(day: string): Promise<DaySummary[]> {
  try {
    const dayWithoutTime = day.split('T')[0]
    const res = await httpClient.get(`/transactions/days/${dayWithoutTime}/summary`)
    return res.data
  } catch (err) {
    console.error('Error fetching day summary:', { day }, err)
    throw err
  }
}
