import { httpClient } from '@api/httpClient'


export async function fetchWeeksOfMonth(monthString: string) {
  return await httpClient
    .get(`/transactions/months/${monthString}/weeks`, {
      params: {
        month: monthString
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}