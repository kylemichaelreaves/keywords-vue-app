import type { Summaries } from '@types'
import { httpClient } from '@api/httpClient'

export async function fetchSummaries(
  timeFrame: string,
  summary = true,
  summaryType = 'historical',
) {
  try {
    const res = await httpClient.get<Array<Summaries>>(`/transactions`, {
      params: {
        summary,
        summaryType,
        timeFrame,
      },
    })
    return res.data
  } catch (err) {
    console.error('Error fetching summaries:', { timeFrame, summary, summaryType }, err)
    throw err
  }
}
