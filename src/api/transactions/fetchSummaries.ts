import type { Summaries } from '@types'
import { httpClient } from '@api/httpClient'

export async function fetchSummaries(timeFrame: string, summary=true, summaryType='historical') {
  return await httpClient
    .get<Array<Summaries>>(`/transactions`, {
      params: {
        summary,
        summaryType,
        timeFrame
      }
    })
    .then((res) => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}