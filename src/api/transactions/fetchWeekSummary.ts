import type { WeekSummary } from '@types'
import { httpClient } from '@api/httpClient'


export async function fetchWeekSummary(week: string): Promise<Array<WeekSummary>> {
  try {
    const response = await httpClient.get(`/transactions/weeks/${week}/summary`)
    return response.data
  } catch (err) {
    console.error('Error fetching week summary:', err)
    throw err
  }
}
