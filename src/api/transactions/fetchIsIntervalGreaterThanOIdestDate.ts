import { httpClient } from '@api/httpClient'


export async function fetchIsIntervalGreaterThanOldestDate(interval: string, dailyTotals=true): Promise<boolean> {
  return await httpClient
    .get(`/transactions`, {
      params: {
        interval,
        dailyTotals
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}