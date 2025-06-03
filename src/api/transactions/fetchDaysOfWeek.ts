import { httpClient } from '@api/httpClient'


export async function fetchDaysOfWeek(week: string) {
  return await httpClient
    .get(`/transactions/weeks/${week}/days`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}